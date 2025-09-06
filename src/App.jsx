import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './components/AuthComponents/Auth';
import Dashboard from './components/DashboardComponents/Dashboard';
import CategoriesPage from './components/CategoryComponents/CategoriesPage';
import Layout from './components/LayoutComponents/Layout';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router> {/* Move Router here to wrap everything */}
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;