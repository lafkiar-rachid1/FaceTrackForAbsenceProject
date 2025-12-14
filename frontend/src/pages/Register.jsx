import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services'
import toast from 'react-hot-toast'
import { UserPlus, Camera } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)

    try {
      await authService.register({
        email: formData.email,
        username: formData.username,
        full_name: formData.full_name,
        password: formData.password,
        role: formData.role,
      })
      toast.success('Inscription réussie! Veuillez vous connecter.')
      navigate('/login')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Camera className="h-16 w-16 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Créer un compte
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom complet
            </label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

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
              Rôle
            </label>
            <select
              className="input-field"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="student">Étudiant</option>
              <option value="teacher">Enseignant</option>
              <option value="admin">Administrateur</option>
            </select>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              required
              className="input-field"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Déjà un compte?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
