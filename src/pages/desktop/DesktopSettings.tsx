
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Brain } from 'lucide-react';
import AISettings from '@/components/desktop/settings/AISettings';
import ProfileSettings from '@/components/desktop/settings/ProfileSettings';
import { useBreadcrumbSetter } from '@/hooks/useBreadcrumbSetter';

const DesktopSettings = () => {
  // Set breadcrumbs for settings
  useBreadcrumbSetter([
    { label: 'Settings', isCurrentPage: true }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and application preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>AI Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AISettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesktopSettings;
