
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AISettingsProvider } from "@/contexts/AISettingsContext";
import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import { useAuth } from "@/contexts/AuthContext";

// Existing imports
import Index from "./pages/Index";
import GatewayPage from "./pages/GatewayPage";
import NotFound from "./pages/NotFound";

// Desktop pages
import DesktopDashboard from "./pages/desktop/DesktopDashboard";
import DesktopLogin from "./pages/desktop/DesktopLogin";
import DesktopSettings from "./pages/desktop/DesktopSettings";
import UserManagement from "./pages/desktop/UserManagement";
import MinimalUserManagement from "./pages/desktop/MinimalUserManagement";
import Documentation from "./pages/desktop/Documentation";
import FloorPlans from "./pages/desktop/FloorPlans";
import MachineRegistry from "./pages/desktop/MachineRegistry";
import OpprDocs from "./pages/desktop/OpprDocs";
import SkillsMatrix from "./pages/desktop/SkillsMatrix";
import TrainingDefinitions from "./pages/desktop/TrainingDefinitions";
import TrainingDefinitionBuilder from "./pages/desktop/TrainingDefinitionBuilder";
import TrainingDefinitionBuilderMinimal from "./pages/desktop/TrainingDefinitionBuilderMinimal";
import TrainingProjects from "./pages/desktop/TrainingProjects";
import TrainingProjectEditor from "./pages/desktop/TrainingProjectEditor";

// Mobile pages
import MobileLogin from "./pages/mobile/MobileLogin";
import MobileSettings from "./pages/mobile/MobileSettings";
import MobileTrainings from "./pages/mobile/MobileTrainings";
import MobileTrainingExecution from "./pages/mobile/MobileTrainingExecution";
import MobileQRScanner from "./pages/mobile/MobileQRScanner";
import MobileTrainingCompletion from "./pages/mobile/MobileTrainingCompletion";

// Layouts
import DesktopLayout from "./components/desktop/DesktopLayout";
import MobileLayout from "./components/mobile/MobileLayout";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/desktop/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AISettingsProvider>
              <BreadcrumbProvider>
                <Routes>
                  <Route path="/" element={<Navigate to="/gateway" replace />} />
                  <Route path="/gateway" element={<GatewayPage />} />
                  
                  {/* Desktop Routes */}
                  <Route path="/desktop/login" element={<DesktopLogin />} />
                  <Route path="/desktop" element={
                    <ProtectedRoute>
                      <DesktopLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<DesktopDashboard />} />
                    <Route path="dashboard" element={<DesktopDashboard />} />
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="user-management-minimal" element={<MinimalUserManagement />} />
                    <Route path="settings" element={<DesktopSettings />} />
                    <Route path="documentation" element={<Documentation />} />
                    <Route path="floor-plans" element={<FloorPlans />} />
                    <Route path="machine-registry" element={<MachineRegistry />} />
                    <Route path="oppr-docs" element={<OpprDocs />} />
                    <Route path="skills-matrix" element={<SkillsMatrix />} />
                    <Route path="training-definitions" element={<TrainingDefinitions />} />
                    <Route path="training-definitions/new" element={<TrainingDefinitionBuilder />} />
                    <Route path="training-definitions/builder/:id" element={<TrainingDefinitionBuilder />} />
                    <Route path="training-definitions/builder-minimal/:id?" element={<TrainingDefinitionBuilderMinimal />} />
                    <Route path="training-definitions/:id" element={<TrainingDefinitionBuilder />} />
                    <Route path="training-projects" element={<TrainingProjects />} />
                    <Route path="training-projects/:projectId" element={<TrainingProjectEditor />} />
                  </Route>

                  {/* Mobile Routes */}
                  <Route path="/mobile/login" element={<MobileLogin />} />
                  <Route path="/mobile" element={
                    <ProtectedRoute>
                      <MobileLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<MobileTrainings />} />
                    <Route path="trainings" element={<MobileTrainings />} />
                    <Route path="settings" element={<MobileSettings />} />
                  </Route>

                  {/* Mobile Training Routes - Outside of MobileLayout for full-screen experience */}
                  <Route path="/mobile/training-execution/:trainingId" element={
                    <ProtectedRoute>
                      <MobileTrainingExecution />
                    </ProtectedRoute>
                  } />
                  <Route path="/mobile/qr-scanner" element={
                    <ProtectedRoute>
                      <MobileQRScanner />
                    </ProtectedRoute>
                  } />
                  <Route path="/mobile/training-completion" element={
                    <ProtectedRoute>
                      <MobileTrainingCompletion />
                    </ProtectedRoute>
                  } />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BreadcrumbProvider>
            </AISettingsProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
