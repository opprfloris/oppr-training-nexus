import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Desktop from './pages/desktop/Desktop';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from '@/components/ui/toaster';
import TrainingDefinitionBuilder from './pages/desktop/TrainingDefinitionBuilder';
import DesktopSettings from './pages/desktop/DesktopSettings';
import { QueryClient } from 'react-query';
import { AISettingsProvider } from '@/contexts/AISettingsContext';

function App() {
  return (
    <AISettingsProvider>
      <QueryClient>
        <div className="min-h-screen bg-gray-50">
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <PrivateRoute path="/desktop" element={<Desktop />} />
                <PrivateRoute path="/desktop/training-definitions/:id" element={<TrainingDefinitionBuilder />} />
                <PrivateRoute path="/desktop/settings" element={<DesktopSettings />} />
                <Route path="/" element={<Login />} />
              </Routes>
              <Toaster />
            </AuthProvider>
          </Router>
        </div>
      </QueryClient>
    </AISettingsProvider>
  );
}

export default App;
