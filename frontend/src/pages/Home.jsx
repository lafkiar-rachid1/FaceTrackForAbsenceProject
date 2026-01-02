import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-3 rounded-xl shadow-md">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">FaceTrack</h1>
                <p className="text-xs text-gray-500 font-medium">Système de Gestion de Présence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold transition-all"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Inscription
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-8 py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
              Technologie de Reconnaissance Faciale
            </span>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Système Intelligent de
            <br />
            <span className="text-blue-600">Gestion de Présence</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Automatisez la prise de présence avec notre solution basée sur l'intelligence artificielle. 
            Rapide, précis et sécurisé.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 mb-20">
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center space-x-2">
                <span>Se connecter</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-blue-600"
            >
              Créer un compte
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Reconnaissance Faciale
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Technologie d'IA avancée pour identifier automatiquement les étudiants avec précision
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Marquage Automatique
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Présence enregistrée instantanément et automatiquement en temps réel
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all">
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Statistiques Détaillées
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tableaux de bord complets avec suivi des présences et analytics
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-lg text-gray-600">
                Quatre étapes simples pour commencer
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  1
                </div>
                <h4 className="font-bold text-gray-800 mb-3 text-lg">Inscription</h4>
                <p className="text-gray-600 leading-relaxed">
                  Créez votre compte en quelques secondes
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  2
                </div>
                <h4 className="font-bold text-gray-800 mb-3 text-lg">Capture</h4>
                <p className="text-gray-600 leading-relaxed">
                  Enregistrez vos photos pour la reconnaissance
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  3
                </div>
                <h4 className="font-bold text-gray-800 mb-3 text-lg">Connexion</h4>
                <p className="text-gray-600 leading-relaxed">
                  Accédez à votre tableau de bord personnel
                </p>
              </div>

              <div className="text-center">
                <div className="bg-orange-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  4
                </div>
                <h4 className="font-bold text-gray-800 mb-3 text-lg">Présence</h4>
                <p className="text-gray-600 leading-relaxed">
                  Marquage automatique lors des sessions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;