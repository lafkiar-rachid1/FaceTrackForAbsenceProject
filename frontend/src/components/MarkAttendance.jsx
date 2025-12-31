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
  const [stream, setStream] = useState(null);

  useEffect(() => {
    loadAvailableSessions();
  }, []);

  const loadAvailableSessions = async () => {
    try {
      console.log('[MarkAttendance] Loading available sessions...');
      const response = await attendanceService.getAvailableSessions();
      console.log('[MarkAttendance] Response:', response);
      console.log('[MarkAttendance] Type:', typeof response, 'IsArray:', Array.isArray(response));
      setAvailableSessions(response);
      if (response.length === 0) {
        console.warn('[MarkAttendance] No active sessions found');
        toast.error('Aucune session active pour le moment');
      } else {
        console.log(`[MarkAttendance] Found ${response.length} active session(s)`);
      }
    } catch (error) {
      console.error('[MarkAttendance] Error loading sessions:', error);
      toast.error('Erreur lors du chargement des sessions');
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCapturing(true);
    } catch (error) {
      toast.error('Impossible d\'accéder à la caméra');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCapturing(false);
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

    setLoading(true);

    try {
      // Capturer l'image
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      // Convertir en base64
      const imageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
      console.log('[MarkAttendance] imageBase64 length:', imageBase64?.length);
      if (!imageBase64 || imageBase64.length < 100) {
        toast.error("Erreur: l'image capturée est vide ou invalide. Veuillez réessayer.");
        setLoading(false);
        return;
      }

      // Envoyer pour reconnaissance
      const response = await attendanceService.recognizeAndMarkAttendance({
        session_id: selectedSession.session_id,
        image_base64: imageBase64
      });

      if (response.success) {
        toast.success(response.message);
        stopCamera();
        if (onSuccess) onSuccess();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
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
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={captureAndRecognize}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 disabled:bg-gray-300 font-medium"
            >
              {loading ? 'Reconnaissance en cours...' : 'Capturer et Marquer Présence'}
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
