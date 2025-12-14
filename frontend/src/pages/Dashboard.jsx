import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { attendanceService } from '../services'
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalPresences: 0,
    thisWeek: 0,
    thisMonth: 0,
  })
  const [recentAttendance, setRecentAttendance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const attendance = await attendanceService.getUserAttendance(user.id)
      setRecentAttendance(attendance.slice(0, 5))
      
      // Calculer les statistiques
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      const thisWeek = attendance.filter(a => new Date(a.check_in_time) > weekAgo).length
      const thisMonth = attendance.filter(a => new Date(a.check_in_time) > monthAgo).length

      setStats({
        totalPresences: attendance.length,
        thisWeek,
        thisMonth,
      })
    } catch (error) {
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Bienvenue, {user?.full_name}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Présences</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPresences}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cette Semaine</p>
              <p className="text-3xl font-bold text-gray-900">{stats.thisWeek}</p>
            </div>
            <Calendar className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ce Mois</p>
              <p className="text-3xl font-bold text-gray-900">{stats.thisMonth}</p>
            </div>
            <Clock className="h-12 w-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Présences Récentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cours</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Entrée</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sortie</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.map((attendance) => (
                <tr key={attendance.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">
                    {new Date(attendance.check_in_time).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3 px-4 text-sm">{attendance.course_name || '-'}</td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(attendance.check_in_time).toLocaleTimeString('fr-FR')}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {attendance.check_out_time 
                      ? new Date(attendance.check_out_time).toLocaleTimeString('fr-FR')
                      : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      attendance.status === 'present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {attendance.status === 'present' ? 'Présent' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
              {recentAttendance.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    Aucune présence enregistrée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
