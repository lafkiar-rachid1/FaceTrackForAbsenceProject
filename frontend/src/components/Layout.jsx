import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LogOut, User, Camera, Calendar, Users, LayoutDashboard } from 'lucide-react'

const Layout = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Camera className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Face Track</span>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600">
                <LayoutDashboard className="h-5 w-5 mr-1" />
                Dashboard
              </Link>
              <Link to="/attendance" className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600">
                <Calendar className="h-5 w-5 mr-1" />
                Présence
              </Link>
              <Link to="/face-registration" className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600">
                <Camera className="h-5 w-5 mr-1" />
                Enregistrer Visage
              </Link>
              <Link to="/attendance-history" className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600">
                <Calendar className="h-5 w-5 mr-1" />
                Historique
              </Link>
              {user?.role === 'admin' && (
                <Link to="/users" className="flex items-center px-3 py-2 text-gray-700 hover:text-primary-600">
                  <Users className="h-5 w-5 mr-1" />
                  Utilisateurs
                </Link>
              )}
              
              <div className="flex items-center space-x-2 border-l pl-4">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700">{user?.full_name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
