import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store';
import { LoadingSpinner, CameraCapture } from '../components';
import { studentService } from '../services';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Form, 2: Camera
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    enrollment_number: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [studentId, setStudentId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    const result = await register({
      full_name: formData.full_name,
      email: formData.email || null,
      phone: formData.phone || null,
      enrollment_number: formData.enrollment_number || null,
      username: formData.username,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      if (result.data.requires_face_capture) {
        // Passer à l'étape de capture de caméra
        setStudentId(result.data.student.student_id);
        setStep(2);
      }
    } else {
      setError(result.error);
    }
  };

  const handleCaptureComplete = async (images) => {
    setLoading(true);
    setError('');

    try {
      await studentService.captureFaces(studentId, images);
      
      // Succès! Rediriger vers login
      alert('Inscription réussie! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (error) {
      setError(error.detail || 'Erreur lors de la sauvegarde des images');
      setStep(1); // Revenir au formulaire en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const handleCancelCapture = () => {
    setStep(1);
    setError('Inscription annulée. Vous devez capturer vos images faciales pour terminer l\'inscription.');
  };

  if (step === 2) {
    return (
      <CameraCapture
        onCaptureComplete={handleCaptureComplete}
        onCancel={handleCancelCapture}
        minImages={10}
        maxImages={30}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Inscription Étudiant</h1>
          <p className="text-green-100">Créez votre compte FaceTrack</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📸 Important!</h3>
            <p className="text-sm text-blue-800">
              Après avoir rempli ce formulaire, vous devrez capturer vos images faciales
              avec votre caméra pour compléter l'inscription.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Omar Bouhaddach"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="omar@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="+212600000000"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Numéro d'inscription
                </label>
                <input
                  type="text"
                  name="enrollment_number"
                  value={formData.enrollment_number}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="101"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nom d'utilisateur <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="omar_b (min. 3 caractères)"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Min. 6 caractères"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Confirmer mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Répétez le mot de passe"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                'Continuer vers la capture 📸'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Connectez-vous ici
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
