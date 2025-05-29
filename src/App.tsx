
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import DesktopDashboard from './pages/desktop/DesktopDashboard';
import DesktopLogin from './pages/desktop/DesktopLogin';
import { Toaster } from '@/components/ui/toaster';
import TrainingDefinitionBuilder from './pages/desktop/TrainingDefinitionBuilder';
import DesktopSettings from './pages/desktop/DesktopSettings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AISettingsProvider } from '@/contexts/AISettingsContext';

const queryClient = new QueryClient();

function App() {
  return (
    <AISettingsProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-50">
          <Router>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<DesktopLogin />} />
                <Route path="/desktop" element={<DesktopDashboard />} />
                <Route path="/desktop/training-definitions/:id" element={<TrainingDefinitionBuilder />} />
                <Route path="/desktop/settings" element={<DesktopSettings />} />
                <Route path="/" element={<DesktopLogin />} />
              </Routes>
              <Toaster />
            </AuthProvider>
          </Router>
        </div>
      </QueryClientProvider>
    </AISettingsProvider>
  );
}

export default App;
