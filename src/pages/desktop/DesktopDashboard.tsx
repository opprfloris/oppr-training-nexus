
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  BookOpen, 
  FolderOpen, 
  Upload,
  Users,
  Cog,
  Building,
  FileText
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { StatCard } from '@/components/desktop/dashboard/StatCard';
import { ResourceHubCard } from '@/components/desktop/dashboard/ResourceHubCard';
import { RecentActivity } from '@/components/desktop/dashboard/RecentActivity';
import { UploadDocumentModal } from '@/components/desktop/dashboard/UploadDocumentModal';

const DesktopDashboard = () => {
  const navigate = useNavigate();
  const { stats, loading, refetch } = useDashboardStats();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Main Dashboard</h1>
          <p className="text-gray-600">Welcome to your training management portal</p>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="oppr-card p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Main Dashboard</h1>
        <p className="text-gray-600">Welcome to your training management portal</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          description="Currently running training projects"
          icon={ClipboardList}
        />
        
        <StatCard
          title="Total Operators"
          value={stats.totalOperators}
          description="Registered operators in system"
          icon={Users}
        />
        
        <StatCard
          title="Training Definitions"
          value={stats.trainingDefinitions}
          description="Available training modules"
          icon={BookOpen}
        />
        
        <StatCard
          title="Machine & QR Entities"
          value={stats.machineEntities}
          description="Registered machines and QR codes"
          icon={Building}
        />
        
        <StatCard
          title="Oppr Docs"
          value={stats.opprDocs}
          description="Uploaded documents and SOPs"
          icon={FileText}
        />
      </div>

      {/* Resource Hub */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Actions & Resource Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ResourceHubCard
            title="Training Projects"
            description="Manage, activate, and monitor all training projects."
            icon={ClipboardList}
            primaryAction={{
              label: "View All Projects",
              onClick: () => navigate('/desktop/training-projects')
            }}
            secondaryAction={{
              label: "+ New Project",
              onClick: () => navigate('/desktop/training-projects?action=create')
            }}
          />

          <ResourceHubCard
            title="Training Definitions"
            description="Create and manage reusable training content modules and versions."
            icon={BookOpen}
            primaryAction={{
              label: "View Definition Library",
              onClick: () => navigate('/desktop/training-definitions')
            }}
            secondaryAction={{
              label: "+ New Definition",
              onClick: () => navigate('/desktop/training-definition-builder')
            }}
          />

          <ResourceHubCard
            title="Floor Plan Library"
            description="Upload and manage floor plan images for your projects."
            icon={FolderOpen}
            primaryAction={{
              label: "View Floor Plans",
              onClick: () => navigate('/desktop/floor-plans')
            }}
            secondaryAction={{
              label: "+ Upload Floor Plan",
              onClick: () => navigate('/desktop/floor-plans?action=upload')
            }}
          />

          <ResourceHubCard
            title="Machine & QR Registry"
            description="Manage global machine and QR code entities for training interactions."
            icon={Building}
            primaryAction={{
              label: "View Registry",
              onClick: () => navigate('/desktop/machine-registry')
            }}
            secondaryAction={{
              label: "+ New Machine+QR",
              onClick: () => navigate('/desktop/machine-registry?action=create')
            }}
          />

          <ResourceHubCard
            title="Oppr Docs - Document Library"
            description="Upload and manage PDF documents (SOPs, manuals) to be used as reference material or AI context within training projects."
            icon={FileText}
            primaryAction={{
              label: "View Document Library",
              onClick: () => navigate('/desktop/oppr-docs')
            }}
            secondaryAction={{
              label: "+ Upload Document",
              onClick: () => setIsUploadModalOpen(true)
            }}
          />

          <ResourceHubCard
            title="User Management"
            description="Manage operators, collaborators, and system users."
            icon={Users}
            primaryAction={{
              label: "View Users",
              onClick: () => navigate('/desktop/user-management')
            }}
            secondaryAction={{
              label: "+ Add User",
              onClick: () => navigate('/desktop/user-management?action=create')
            }}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={stats.recentActivities} />

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={() => {
          refetch();
          setIsUploadModalOpen(false);
        }}
      />
    </div>
  );
};

export default DesktopDashboard;
