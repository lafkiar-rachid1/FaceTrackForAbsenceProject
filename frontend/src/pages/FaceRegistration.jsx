import { useState, useRef } from 'react'
import Webcam from 'react-webcam'
import { useAuthStore } from '../store/authStore'
import { faceService } from '../services'
import toast from 'react-hot-toast'
import { Camera, Upload } from 'lucide-react'

const FaceRegistration = () => {
  const { user } = useAuthStore()
  const webcamRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [useWebcam, setUseWebcam] = useState(true)

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setCapturedImage(imageSrc)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapturedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!capturedImage) {
      toast.error('Veuillez capturer ou télécharger une image')
      return
    }

    setLoading(true)

    try {
      // Convertir base64 en blob
      const response = await fetch(capturedImage)
      const blob = await response.blob()
      const file = new File([blob], 'face.jpg', { type: 'image/jpeg' })

      await faceService.registerFace(user.id, file)
      toast.success('Visage enregistré avec succès!')
      setCapturedImage(null)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Enregistrer votre visage
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Capture Section */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {useWebcam ? 'Webcam' : 'Téléchargement'}
            </h2>
            <button
              onClick={() => setUseWebcam(!useWebcam)}
              className="btn-secondary text-sm"
            >
              {useWebcam ? 'Télécharger une photo' : 'Utiliser la webcam'}
            </button>
          </div>

          {useWebcam ? (
            <div>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg mb-4"
              />
              <button
                onClick={capturePhoto}
                className="w-full btn-primary flex items-center justify-center"
              >
                <Camera className="h-5 w-5 mr-2" />
                Capturer la photo
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <label className="cursor-pointer">
                <span className="btn-primary inline-flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Choisir une photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aperçu</h2>
          {capturedImage ? (
            <div>
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full rounded-lg mb-4"
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 btn-primary"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  onClick={() => setCapturedImage(null)}
                  className="flex-1 btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <p className="text-gray-500">Aucune image capturée</p>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Instructions</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Assurez-vous que votre visage est bien éclairé</li>
          <li>Regardez directement la caméra</li>
          <li>Évitez les ombres sur votre visage</li>
          <li>Un seul visage doit être visible dans l'image</li>
          <li>Retirez les lunettes de soleil ou accessoires qui cachent votre visage</li>
        </ul>
      </div>
    </div>
  )
}

export default FaceRegistration
