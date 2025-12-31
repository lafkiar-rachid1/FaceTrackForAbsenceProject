import React, { useRef, useState, useEffect, useCallback } from 'react';

const CameraCapture = ({ onCaptureComplete, onCancel, minImages = 10, maxImages = 30 }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);

  // Démarrer la caméra
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setError(null);
    } catch (err) {
      console.error('Erreur caméra:', err);
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // Convertir en base64
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  const handleStartCapture = () => {
    setIsCapturing(true);
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null || countdown === 0) {
      if (countdown === 0 && isCapturing) {
        // Commencer la capture automatique
        const interval = setInterval(() => {
          if (capturedImages.length < maxImages) {
            const imageData = captureImage();
            if (imageData) {
              setCapturedImages((prev) => [...prev, imageData]);
            }
          } else {
            setIsCapturing(false);
            clearInterval(interval);
          }
        }, 200); // Capturer toutes les 200ms

        return () => clearInterval(interval);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isCapturing, capturedImages.length, maxImages, captureImage]);

  const handleManualCapture = () => {
    if (capturedImages.length >= maxImages) {
      alert(`Maximum de ${maxImages} images atteint`);
      return;
    }

    const imageData = captureImage();
    if (imageData) {
      setCapturedImages((prev) => [...prev, imageData]);
    }
  };

  const handleComplete = () => {
    if (capturedImages.length < minImages) {
      alert(`Veuillez capturer au moins ${minImages} images`);
      return;
    }

    stopCamera();
    
    // Convertir les images en base64 pur (sans le préfixe data:image/jpeg;base64,)
    const base64Images = capturedImages.map((img) => img.split(',')[1]);
    onCaptureComplete(base64Images);
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  const removeImage = (index) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Capture de votre visage
          </h2>

          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : (
            <>
              {/* Zone vidéo */}
              <div className="relative mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg border-4 border-blue-500"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Overlay countdown */}
                {countdown !== null && countdown > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <span className="text-white text-9xl font-bold">{countdown}</span>
                  </div>
                )}

                {/* Overlay guide */}
                <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
                  <p className="text-sm">
                    📸 Images capturées: {capturedImages.length} / {maxImages}
                  </p>
                  {capturedImages.length < minImages && (
                    <p className="text-xs text-yellow-300">
                      Minimum requis: {minImages}
                    </p>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Regardez la caméra</li>
                  <li>Bougez légèrement la tête (gauche, droite, haut, bas)</li>
                  <li>Gardez un éclairage correct</li>
                  <li>Capturez au moins {minImages} images</li>
                </ul>
              </div>

              {/* Boutons de contrôle */}
              <div className="flex gap-4 mb-4">
                {!isCapturing && capturedImages.length < maxImages && (
                  <>
                    <button
                      onClick={handleStartCapture}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      🎥 Capture Automatique
                    </button>
                    <button
                      onClick={handleManualCapture}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      📷 Capture Manuelle
                    </button>
                  </>
                )}
                
                {isCapturing && (
                  <button
                    onClick={() => setIsCapturing(false)}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    ⏸️ Arrêter la capture
                  </button>
                )}
              </div>

              {/* Galerie d'images capturées */}
              {capturedImages.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Images capturées ({capturedImages.length})
                  </h3>
                  <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto border rounded p-2">
                    {capturedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Capture ${index + 1}`}
                          className="w-full h-16 object-cover rounded border"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex gap-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleComplete}
                  disabled={capturedImages.length < minImages}
                  className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors ${
                    capturedImages.length >= minImages
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  ✓ Terminer ({capturedImages.length} images)
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
