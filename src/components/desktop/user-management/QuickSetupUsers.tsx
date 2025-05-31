
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface QuickSetupUsersProps {
  onUsersCreated: () => void;
}

export const QuickSetupUsers: React.FC<QuickSetupUsersProps> = ({ onUsersCreated }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const testUsers = [
    {
      firstName: 'Carl',
      lastName: 'Operations',
      email: 'carl@oppr.ai',
      department: 'Operations',
      role: 'Operator',
      password: 'carl123'
    },
    {
      firstName: 'Bert',
      lastName: 'Operations',
      email: 'bert@oppr.ai',
      department: 'Operations',
      role: 'Operator',
      password: 'bert123'
    }
  ];

  const createTestUsers = async () => {
    setLoading(true);
    console.log('Creating test users...');

    try {
      for (const user of testUsers) {
        console.log(`Creating user: ${user.email}`);
        
        const { data, error } = await supabase.functions.invoke('create-user', {
          body: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            department: user.department,
            role: user.role,
            password: user.password,
            avatarUrl: null
          }
        });

        if (error) {
          console.error(`Error creating user ${user.email}:`, error);
          throw new Error(`Failed to create ${user.email}: ${error.message}`);
        }

        if (!data || !data.success) {
          console.error(`Edge Function returned unsuccessful result for ${user.email}:`, data);
          throw new Error(`Failed to create ${user.email}: ${data?.error || 'Unknown error'}`);
        }

        console.log(`Successfully created user: ${user.email}`);
      }

      toast({
        title: "Success",
        description: "Test users Carl and Bert created successfully",
      });

      onUsersCreated();
    } catch (error: any) {
      console.error('Error creating test users:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create test users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={createTestUsers}
      disabled={loading}
      variant="outline"
      size="sm"
      className="ml-2"
    >
      {loading ? 'Creating...' : 'Add Test Users (Carl & Bert)'}
    </Button>
  );
};
