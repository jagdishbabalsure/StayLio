import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './components/Login';
import HostRegistrationPage from './pages/HostRegistrationPage';
import AuthTestPage from './pages/AuthTestPage';
import Dashboard from './pages/Dashboard';
import HostsManagement from './pages/HostsManagement';
import AdminsManagement from './pages/AdminsManagement';
import UsersManagement from './pages/UsersManagement';
import HotelsManagement from './pages/HotelsManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<HostRegistrationPage />} />
            <Route path="/auth-test" element={<AuthTestPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Admin Only Routes */}
            <Route path="/hosts" element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <HostsManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admins" element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <AdminsManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <UsersManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/hotels" element={
              <ProtectedRoute requiredRole="admin">
                <Layout>
                  <HotelsManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Host Only Routes */}
            <Route path="/my-hotels" element={
              <ProtectedRoute requiredRole="host">
                <Layout>
                  <HotelsManagement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/bookings" element={
              <ProtectedRoute requiredRole="host">
                <Layout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Bookings Management</h2>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Settings</h2>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Route */}
            <Route path="*" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Page not found</p>
                  <button
                    onClick={() => window.history.back()}
                    className="btn-primary"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
