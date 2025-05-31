
import React, { useState } from 'react';
import { useBreadcrumbSetter } from '@/hooks/useBreadcrumbSetter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { WorkflowStep } from '@/components/desktop/getting-started/WorkflowStep';
import { InteractiveChecklist } from '@/components/desktop/getting-started/InteractiveChecklist';
import { FeatureShowcase } from '@/components/desktop/getting-started/FeatureShowcase';
import { 
  DocumentIcon, 
  BookOpenIcon, 
  MapIcon, 
  UsersIcon, 
  DevicePhoneMobileIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const GettingStarted = () => {
  useBreadcrumbSetter([
    { label: 'Getting Started', isCurrentPage: true }
  ]);

  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const workflowSteps = [
    {
      id: 'documents',
      title: 'Document Management Foundation',
      description: 'Upload and organize your training materials with AI-powered analysis',
      icon: DocumentIcon,
      estimatedTime: '10-15 minutes',
      keyFeatures: [
        'Upload multiple document formats (PDF, DOC, images)',
        'Automatic AI analysis and content extraction',
        'Hierarchical folder organization',
        'Full-text search capabilities'
      ],
      actionButton: {
        label: 'Go to Oppr Docs',
        onClick: () => navigate('/desktop/oppr-docs')
      }
    },
    {
      id: 'definitions',
      title: 'Create Training Definitions',
      description: 'Build interactive training flows manually or with AI assistance',
      icon: BookOpenIcon,
      estimatedTime: '15-30 minutes',
      keyFeatures: [
        'AI-powered training generation from documents',
        'Visual flow builder with drag-and-drop',
        'Multiple step types (information, questions, goto)',
        'Version control and publishing workflow'
      ],
      actionButton: {
        label: 'Create Training Definition',
        onClick: () => navigate('/desktop/training-definitions')
      }
    },
    {
      id: 'projects',
      title: 'Project Setup & Deployment',
      description: 'Convert definitions into real-world training projects',
      icon: MapIcon,
      estimatedTime: '20-25 minutes',
      keyFeatures: [
        'Floor plan integration with interactive markers',
        'QR code generation for equipment-based training',
        'User assignment and role-based access',
        'Real-time progress tracking'
      ],
      actionButton: {
        label: 'Create Training Project',
        onClick: () => navigate('/desktop/training-projects')
      }
    },
    {
      id: 'users',
      title: 'User Management & Skills Tracking',
      description: 'Set up teams and monitor competency development',
      icon: UsersIcon,
      estimatedTime: '10-20 minutes',
      keyFeatures: [
        'Role-based access control (Admin, Manager, Operator)',
        'Skills matrix with visual progress tracking',
        'Department and team organization',
        'Bulk user import capabilities'
      ],
      actionButton: {
        label: 'Manage Users',
        onClick: () => navigate('/desktop/user-management')
      }
    },
    {
      id: 'execution',
      title: 'Training Execution',
      description: 'Deploy and monitor training on mobile devices',
      icon: DevicePhoneMobileIcon,
      estimatedTime: '5-10 minutes',
      keyFeatures: [
        'Mobile-optimized training interface',
        'QR code scanning for equipment identification',
        'Offline capability and sync',
        'Real-time progress updates'
      ],
      actionButton: {
        label: 'View Mobile Demo',
        onClick: () => window.open('/mobile', '_blank')
      }
    }
  ];

  const quickStartItems = [
    { id: 'upload-docs', label: 'Upload your first training document', estimated: '5 min' },
    { id: 'create-definition', label: 'Create a training definition', estimated: '15 min' },
    { id: 'setup-project', label: 'Set up your first project', estimated: '10 min' },
    { id: 'add-users', label: 'Add team members', estimated: '5 min' },
    { id: 'test-mobile', label: 'Test on mobile device', estimated: '5 min' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <SparklesIcon className="w-8 h-8 text-oppr-blue" />
          <h1 className="text-4xl font-bold text-gray-900">Welcome to OPPR Training Platform</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Transform your industrial training programs with AI-powered content generation, 
          interactive learning experiences, and comprehensive progress tracking.
        </p>
        
        <div className="flex items-center justify-center space-x-8 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-oppr-blue">5</div>
            <div className="text-sm text-gray-600">Core Modules</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-oppr-blue">∞</div>
            <div className="text-sm text-gray-600">Training Possibilities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-oppr-blue">60min</div>
            <div className="text-sm text-gray-600">Setup Time</div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Platform Overview Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <span>Complete Training Lifecycle</span>
          </CardTitle>
          <CardDescription>
            See how all components work together to create a comprehensive training solution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureShowcase />
        </CardContent>
      </Card>

      {/* Quick Start Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ClockIcon className="w-6 h-6 text-oppr-blue" />
            <span>Quick Start Checklist</span>
            <Badge variant="secondary">~40 minutes total</Badge>
          </CardTitle>
          <CardDescription>
            Follow this checklist to get your first training program up and running
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InteractiveChecklist 
            items={quickStartItems}
            completedItems={completedSteps}
            onItemComplete={(itemId) => {
              if (!completedSteps.includes(itemId)) {
                setCompletedSteps([...completedSteps, itemId]);
              }
            }}
          />
          <div className="mt-4">
            <Progress value={(completedSteps.length / quickStartItems.length) * 100} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              {completedSteps.length} of {quickStartItems.length} steps completed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Workflow Steps */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Step-by-Step Workflow</h2>
          <p className="text-gray-600">Follow this comprehensive guide to master the OPPR Training Platform</p>
        </div>

        {workflowSteps.map((step, index) => (
          <WorkflowStep
            key={step.id}
            step={step}
            stepNumber={index + 1}
            isCompleted={completedSteps.includes(step.id)}
            onComplete={() => {
              if (!completedSteps.includes(step.id)) {
                setCompletedSteps([...completedSteps, step.id]);
              }
            }}
          />
        ))}
      </div>

      {/* Advanced Features Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Features & Capabilities</CardTitle>
          <CardDescription>
            Unlock the full potential of the platform with these advanced features
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">AI Customization</h4>
            <p className="text-sm text-gray-600">Fine-tune AI settings for optimal content generation</p>
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/desktop/settings')}>
              Configure AI Settings →
            </Button>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Analytics & Reporting</h4>
            <p className="text-sm text-gray-600">Track performance with detailed analytics and insights</p>
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/desktop/skills-matrix')}>
              View Skills Matrix →
            </Button>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Floor Plan Integration</h4>
            <p className="text-sm text-gray-600">Create spatial training experiences with interactive floor plans</p>
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/desktop/floor-plans')}>
              Manage Floor Plans →
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support & Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>Additional resources to help you succeed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 text-left flex-col items-start"
              onClick={() => navigate('/desktop/documentation')}
            >
              <span className="font-semibold">📚 Complete Documentation</span>
              <span className="text-sm text-gray-600 mt-1">
                Detailed guides, API references, and best practices
              </span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 text-left flex-col items-start"
              onClick={() => window.open('mailto:support@oppr.com')}
            >
              <span className="font-semibold">💬 Contact Support</span>
              <span className="text-sm text-gray-600 mt-1">
                Get help from our expert support team
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GettingStarted;
