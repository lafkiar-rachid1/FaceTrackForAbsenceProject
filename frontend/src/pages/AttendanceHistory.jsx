import { useEffect, useState } from 'react'
import { attendanceService } from '../services'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { Calendar, Filter } from 'lucide-react'

const AttendanceHistory = () => {
  const { user } = useAuthStore()
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, week, month

  useEffect(() => {
    fetchAttendance()
  }, [user, filter])

  const fetchAttendance = async () => {
    try {
      const data = user.role === 'admin' 
        ? await attendanceService.getAllAttendance()
        : await attendanceService.getUserAttendance(user.id)
      
      // Filtrer par période
      const now = new Date()
      let filtered = data

      if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        filtered = data.filter(a => new Date(a.check_in_time) > weekAgo)
      } else if (filter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        filtered = data.filter(a => new Date(a.check_in_time) > monthAgo)
      }

      setAttendance(filtered)
    } catch (error) {
      toast.error('Erreur lors du chargement de l\'historique')
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Historique des présences
        </h1>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field py-2"
          >
            <option value="all">Tout</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                {user.role === 'admin' && (
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Utilisateur</th>
                )}
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cours</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Entrée</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sortie</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Méthode</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Confiance</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">
                    {new Date(record.check_in_time).toLocaleDateString('fr-FR')}
                  </td>
                  {user.role === 'admin' && (
                    <td className="py-3 px-4 text-sm">User #{record.user_id}</td>
                  )}
                  <td className="py-3 px-4 text-sm">{record.course_name || '-'}</td>
                  <td className="py-3 px-4 text-sm">
                    {new Date(record.check_in_time).toLocaleTimeString('fr-FR')}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {record.check_out_time 
                      ? new Date(record.check_out_time).toLocaleTimeString('fr-FR')
                      : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {record.verification_method === 'face_recognition' ? 'Reconnaissance' : 'Manuel'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{record.confidence_score || '-'}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {record.status === 'present' ? 'Présent' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
              {attendance.length === 0 && (
                <tr>
                  <td colSpan={user.role === 'admin' ? "8" : "7"} className="py-8 text-center text-gray-500">
                    Aucune présence trouvée
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

export default AttendanceHistory
