
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Gateway and Auth
import GatewayPage from "./pages/GatewayPage";
import MobileLogin from "./pages/mobile/MobileLogin";
import DesktopLogin from "./pages/desktop/DesktopLogin";

// Mobile Experience
import MobileLayout from "./components/mobile/MobileLayout";
import MobileTrainings from "./pages/mobile/MobileTrainings";
import MobileSettings from "./pages/mobile/MobileSettings";

// Desktop Experience
import DesktopLayout from "./components/desktop/DesktopLayout";
import DesktopDashboard from "./pages/desktop/DesktopDashboard";
import TrainingDefinitions from "./pages/desktop/TrainingDefinitions";
import TrainingProjects from "./pages/desktop/TrainingProjects";
import FloorPlans from "./pages/desktop/FloorPlans";
import MachineRegistry from "./pages/desktop/MachineRegistry";
import UserManagement from "./pages/desktop/UserManagement";
import SkillsMatrix from "./pages/desktop/SkillsMatrix";
import DesktopSettings from "./pages/desktop/DesktopSettings";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Gateway */}
            <Route path="/" element={<GatewayPage />} />
            
            {/* Mobile Experience */}
            <Route path="/mobile/login" element={<MobileLogin />} />
            <Route path="/mobile" element={<MobileLayout />}>
              <Route index element={<MobileTrainings />} />
              <Route path="trainings" element={<MobileTrainings />} />
              <Route path="settings" element={<MobileSettings />} />
            </Route>
            
            {/* Desktop Experience */}
            <Route path="/desktop/login" element={<DesktopLogin />} />
            <Route path="/desktop" element={<DesktopLayout />}>
              <Route index element={<DesktopDashboard />} />
              <Route path="dashboard" element={<DesktopDashboard />} />
              <Route path="training-definitions" element={<TrainingDefinitions />} />
              <Route path="training-projects" element={<TrainingProjects />} />
              <Route path="floor-plans" element={<FloorPlans />} />
              <Route path="machine-registry" element={<MachineRegistry />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="skills-matrix" element={<SkillsMatrix />} />
              <Route path="settings" element={<DesktopSettings />} />
            </Route>
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
