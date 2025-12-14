import api from './api'

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

export const userService = {
  getUsers: async () => {
    const response = await api.get('/users')
    return response.data
  },

  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`)
    return response.data
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`)
    return response.data
  },
}

export const attendanceService = {
  createAttendance: async (data) => {
    const response = await api.post('/attendance', data)
    return response.data
  },

  getAllAttendance: async () => {
    const response = await api.get('/attendance')
    return response.data
  },

  getUserAttendance: async (userId) => {
    const response = await api.get(`/attendance/user/${userId}`)
    return response.data
  },

  getAttendanceByDate: async (date) => {
    const response = await api.get(`/attendance/date/${date}`)
    return response.data
  },

  checkout: async (attendanceId) => {
    const response = await api.put(`/attendance/${attendanceId}/checkout`)
    return response.data
  },
}

export const faceService = {
  registerFace: async (userId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post(`/face/register-face/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  verifyFace: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/face/verify-face', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  markAttendanceWithFace: async (file, courseName) => {
    const formData = new FormData()
    formData.append('file', file)
    if (courseName) {
      formData.append('course_name', courseName)
    }
    const response = await api.post('/face/attendance-with-face', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },
}
