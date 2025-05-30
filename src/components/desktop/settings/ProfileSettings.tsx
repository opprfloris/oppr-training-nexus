
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { UserCircleIcon, KeyIcon, CameraIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

const ProfileSettings: React.FC = () => {
  const { user, profile, updateProfile, refreshProfile, loading } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const departments = [
    'Assembly Line 1',
    'Assembly Line 3', 
    'Maintenance',
    'Quality Control',
    'Operations',
    'Training Department'
  ];

  useEffect(() => {
    if (profile) {
      setProfileData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        department: profile.department || '',
        email: profile.email || ''
      });
      setAvatarPreview(profile.avatar_url);
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
    try {
      // Delete old avatar if it exists
      if (profile?.avatar_url) {
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName && oldFileName !== 'undefined') {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${oldFileName}`]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      return null;
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      toast({
        title: "Validation Error",
        description: "First name and last name are required.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not found.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      let avatarUrl = profile?.avatar_url;

      // Handle avatar upload
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(user.id, avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          throw new Error('Failed to upload avatar');
        }
      } else if (avatarPreview === null && profile?.avatar_url) {
        // Remove avatar if it was removed
        if (profile.avatar_url) {
          const oldFileName = profile.avatar_url.split('/').pop();
          if (oldFileName && oldFileName !== 'undefined') {
            await supabase.storage
              .from('avatars')
              .remove([`${user.id}/${oldFileName}`]);
          }
        }
        avatarUrl = null;
      }

      const { error } = await updateProfile({
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        department: profileData.department,
        avatar_url: avatarUrl,
      });

      if (error) throw error;

      // Clear the file input since it's been uploaded
      setAvatarFile(null);

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Note: Password change would require additional Supabase setup
    toast({
      title: "Feature Coming Soon",
      description: "Password change functionality will be available soon.",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-2 mb-6">
        <UserCircleIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">My Profile</h2>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCircleIcon className="w-5 h-5" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserCircleIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Profile Picture</h3>
              <div className="flex space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-2"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <CameraIcon className="w-4 h-4" />
                  <span>Change Photo</span>
                </Button>
                {avatarPreview && (
                  <Button variant="outline" size="sm" onClick={removeAvatar}>
                    Remove Photo
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500">JPG, PNG up to 2MB</p>
            </div>
          </div>

          <Separator />

          {/* Profile Form */}
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Email address cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select 
                value={profileData.department} 
                onValueChange={(value) => setProfileData(prev => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={profile?.role || ''}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">Role is managed by administrators</p>
            </div>

            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input
                value={profile?.created_at ? format(new Date(profile.created_at), 'MMMM d, yyyy') : ''}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <KeyIcon className="w-5 h-5" />
            <span>Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showPasswordForm ? (
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-sm text-gray-500">Change your account password</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
