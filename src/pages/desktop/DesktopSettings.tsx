
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Lock, Brain } from 'lucide-react';
import AISettings from '@/components/desktop/settings/AISettings';

const DesktopSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and application preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>Change Password</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>AI Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6">
            <div className="oppr-card p-6">
              <h3 className="text-lg font-medium">Profile Information</h3>
              <p className="text-sm text-muted-foreground">
                Update your account profile information and email address.
              </p>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Profile management features coming soon...
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6">
            <div className="oppr-card p-6">
              <h3 className="text-lg font-medium">Change Password</h3>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure.
              </p>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Password management features coming soon...
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <AISettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesktopSettings;
