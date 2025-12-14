import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { LogIn, Camera } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.login(formData)
      // Sauvegarder le token AVANT de l'utiliser
      setAuth(null, response.access_token)
      // Maintenant récupérer les infos utilisateur avec le token
      const userData = await authService.getCurrentUser()
      setAuth(userData, response.access_token)
      toast.success('Connexion réussie!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Camera className="h-16 w-16 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Face Track Absence
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              required
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center"
          >
            <LogIn className="h-5 w-5 mr-2" />
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
