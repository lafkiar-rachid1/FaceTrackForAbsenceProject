import { useState, useRef } from 'react'
import Webcam from 'react-webcam'
import { faceService } from '../services'
import toast from 'react-hot-toast'
import { Camera, CheckCircle } from 'lucide-react'

const Attendance = () => {
  const webcamRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [courseName, setCourseName] = useState('')
  const [result, setResult] = useState(null)

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setCapturedImage(imageSrc)
  }

  const handleSubmit = async () => {
    if (!capturedImage) {
      toast.error('Veuillez capturer une photo')
      return
    }

    setLoading(true)

    try {
      // Convertir base64 en blob
      const response = await fetch(capturedImage)
      const blob = await response.blob()
      const file = new File([blob], 'attendance.jpg', { type: 'image/jpeg' })

      const result = await faceService.markAttendanceWithFace(file, courseName)
      setResult(result)
      toast.success('Présence enregistrée avec succès!')
      setCapturedImage(null)
      setCourseName('')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'enregistrement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Enregistrer la présence
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Capture Section */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Capture</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du cours (optionnel)
            </label>
            <input
              type="text"
              className="input-field"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Ex: Mathématiques"
            />
          </div>

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
            Capturer
          </button>
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
                  {loading ? 'Vérification...' : 'Valider la présence'}
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

      {/* Result */}
      {result && (
        <div className="card mt-8 bg-green-50 border-2 border-green-200">
          <div className="flex items-center">
            <CheckCircle className="h-12 w-12 text-green-600 mr-4" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Présence confirmée!
              </h3>
              <p className="text-gray-700">
                Utilisateur: <span className="font-semibold">{result.user}</span>
              </p>
              <p className="text-gray-700">
                Confiance: <span className="font-semibold">{result.confidence}</span>
              </p>
              {courseName && (
                <p className="text-gray-700">
                  Cours: <span className="font-semibold">{courseName}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Attendance
