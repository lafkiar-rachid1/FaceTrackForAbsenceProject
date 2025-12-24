import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'


function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
      </Routes>
    </Router>
  )
}

export default App
