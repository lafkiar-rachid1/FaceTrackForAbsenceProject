import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import attendanceService from '../services/attendanceService';

const MarkAttendance = ({ onSuccess }) => {
  const [availableSessions, setAvailableSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null); // Nouveau ref pour l'overlay
  const [stream, setStream] = useState(null);

  useEffect(() => {
    loadAvailableSessions();

    // Nettoyage du stream à la fermeture du composant
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const loadAvailableSessions = async () => {
    try {
      console.log('[MarkAttendance] Loading available sessions...');
      const response = await attendanceService.getAvailableSessions();
      console.log('[MarkAttendance] Response:', response);
      if (Array.isArray(response)) {
        setAvailableSessions(response);
        if (response.length === 0) {
          toast.error('Aucune session active pour le moment');
        } else {
          console.log(`[MarkAttendance] Found ${response.length} active session(s)`);
        }
      } else {
        console.error('[MarkAttendance] Invalid response format', response);
        setAvailableSessions([]);
      }
    } catch (error) {
      console.error('[MarkAttendance] Error loading sessions:', error);
      toast.error('Erreur lors du chargement des sessions');
    }
  };

  // Effet pour attacher le stream à la vidéo une fois que l'élément est monté
  useEffect(() => {
    if (stream && capturing && videoRef.current) {
      console.log('[MarkAttendance] Attaching stream to video element');
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        console.log('[MarkAttendance] Video metadata loaded, playing...');
        videoRef.current.play().catch(e => console.error('Error playing video:', e));
      };
    }
  }, [stream, capturing]);

  const startCamera = async () => {
    try {
      console.log('[MarkAttendance] Requesting camera access...');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false
      });

      console.log('[MarkAttendance] Camera access granted');
      setStream(mediaStream);
      setCapturing(true); // Cela va provoquer le rendu de l'élément <video>
    } catch (error) {
      console.error('[MarkAttendance] Camera error:', error);
      toast.error('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCapturing(false);
  };

  const drawFaceOverlay = (area, success, message) => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay || !area) return;

    const ctx = overlay.getContext('2d');

    // Ajuster la taille du canvas à la taille affichée de la vidéo
    overlay.width = video.clientWidth;
    overlay.height = video.clientHeight;

    // Calculer le ratio de mise à l'échelle (taille affichée / taille réelle (ou de capture, ici le backend envoie en coords réelles))
    // Note: Le backend renvoie les coordonnées relatives à l'image envoyée (640x480 théorique si la caméra le supporte)
    // On doit utiliser videoWidth/videoHeight réels de l'élément video
    const scaleX = video.clientWidth / video.videoWidth;
    const scaleY = video.clientHeight / video.videoHeight;

    const x = area.x * scaleX;
    const y = area.y * scaleY;
    const w = area.w * scaleX;
    const h = area.h * scaleY;

    // Nettoyer
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    // Dessiner le cadre
    ctx.strokeStyle = success ? '#00ff00' : '#ff0000';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Dessiner le fond du texte
    ctx.fillStyle = success ? '#00ff00' : '#ff0000';
    const text = message || (success ? "Présent" : "Inconnu");
    const fontSize = 16;
    ctx.font = `bold ${fontSize}px Arial`;
    const textWidth = ctx.measureText(text).width;
    ctx.fillRect(x, y - fontSize - 10, textWidth + 10, fontSize + 10);

    // Dessiner le texte
    ctx.fillStyle = '#000000';
    ctx.fillText(text, x + 5, y - 5);
  };

  const captureAndRecognize = async () => {
    if (!selectedSession) {
      toast.error('Veuillez sélectionner une session');
      return;
    }

    if (!videoRef.current || !canvasRef.current) {
      toast.error("Erreur d'initialisation de la caméra");
      return;
    }

    // Nettoyer l'overlay précédent
    if (overlayRef.current) {
      const ctx = overlayRef.current.getContext('2d');
      ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }

    setLoading(true);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      // Vérification des dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        toast.error("La caméra n'est pas encore prête. Veuillez réessayer dans un instant.");
        setLoading(false);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

      if (!imageBase64 || imageBase64.length < 100) {
        toast.error("Erreur: l'image capturée est vide ou invalide. Veuillez réessayer.");
        setLoading(false);
        return;
      }

      console.log('[MarkAttendance] Sending image for recognition...');
      const response = await attendanceService.recognizeAndMarkAttendance({
        session_id: selectedSession.session_id,
        image_base64: imageBase64
      });

      console.log('[MarkAttendance] Received response:', response);

      if (response.success) {
        toast.success(response.message);

        // Dessiner le cadre si disponible
        if (response.face_area) {
          const studentName = response.detected_students && response.detected_students[0]
            ? response.detected_students[0].full_name
            : "Moi";
          const confidence = response.detected_students && response.detected_students[0]
            ? (response.detected_students[0].confidence * 100).toFixed(0) + '%'
            : "";

          drawFaceOverlay(response.face_area, true, `${studentName} (${confidence})`);
        }

        // Attendre 2 secondes avant de fermer pour laisser voir le résultat
        setTimeout(() => {
          stopCamera();
          if (onSuccess) onSuccess();
        }, 2000);

      } else {
        toast.error(response.message);
        if (response.face_area) {
          drawFaceOverlay(response.face_area, false, "Non reconnu");
        }
      }
    } catch (error) {
      console.error('[MarkAttendance] Error:', error);
      toast.error(error.detail || 'Erreur lors de la reconnaissance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Marquer ma Présence</h2>

      {/* Sessions disponibles */}
      {availableSessions.length > 0 ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sessions Actives
          </label>
          <select
            value={selectedSession?.session_id || ''}
            onChange={(e) => {
              const session = availableSessions.find(s => s.session_id === parseInt(e.target.value));
              setSelectedSession(session);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Sélectionner une session</option>
            {availableSessions.map((session) => (
              <option key={session.session_id} value={session.session_id}>
                {session.course_name} - {session.start_time} à {session.end_time} ({session.location})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-800">Aucune session active pour le moment</p>
        </div>
      )}

      {/* Caméra */}
      {!capturing ? (
        <button
          onClick={startCamera}
          disabled={!selectedSession}
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
        >
          Démarrer la Caméra
        </button>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto"
            />
            {/* Overlay Canvas pour le cadre */}
            <canvas
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none w-full h-full"
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={captureAndRecognize}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:bg-gray-300 font-medium"
            >
              {loading ? 'Analyse en cours...' : 'Capturer et Marquer Présence'}
            </button>
            <button
              onClick={stopCamera}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 disabled:bg-gray-300 font-medium"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
