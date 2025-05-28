import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DesktopSettings = () => {
  const { user, profile, signOut, updateProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    department: profile?.department || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        department: profile.department || '',
      });
    }
  }, [profile]);

  const handleLogout = async () => {
    await signOut();
  };

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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let avatarUrl = profile?.avatar_url;

      // Upload new avatar if provided
      if (avatarFile && user?.id) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        console.log('Uploading avatar:', fileName);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) {
          console.error('Avatar upload error:', uploadError);
          toast({
            title: "Warning",
            description: "Avatar upload failed, but profile will be updated without it",
            variant: "destructive",
          });
        } else {
          const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
          avatarUrl = data.publicUrl;
          console.log('Avatar uploaded successfully:', avatarUrl);
        }
      }

      const { error } = await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        department: formData.department,
        avatar_url: avatarUrl
      });

      if (error) throw error;

      // Refresh the profile to get the latest data
      await refreshProfile();

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setAvatarFile(null);
      setAvatarPreview(null);

    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your profile and account preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Profile */}
        <div className="oppr-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">My Profile</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Avatar failed to load:', profile.avatar_url);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-2xl text-gray-600">👤</span>
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {profile?.first_name && profile?.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : profile?.role || 'User'
                    }
                  </p>
                  <p className="text-gray-600">{profile?.email || user?.email}</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <button 
                    type="button"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    className="text-sm text-oppr-blue hover:underline"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <Input 
                    type="text" 
                    placeholder="First name" 
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <Input 
                    type="text" 
                    placeholder="Last name" 
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input 
                    type="email" 
                    className="bg-gray-100" 
                    placeholder="Email" 
                    value={profile?.email || user?.email || ''} 
                    readOnly 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({...prev, department: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assembly Line 1">Assembly Line 1</SelectItem>
                      <SelectItem value="Assembly Line 3">Assembly Line 3</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Quality Control">Quality Control</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Training Department">Training Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#3a7ca5] hover:bg-[#2f6690] text-white"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="oppr-card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <Input 
                  type="password" 
                  placeholder="Current password" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({...prev, currentPassword: e.target.value}))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <Input 
                  type="password" 
                  placeholder="New password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({...prev, newPassword: e.target.value}))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <Input 
                  type="password" 
                  placeholder="Confirm new password" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({...prev, confirmPassword: e.target.value}))}
                />
              </div>
              
              <div className="mt-6">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#3a7ca5] hover:bg-[#2f6690] text-white"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <button 
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 font-medium flex items-center"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DesktopSettings;
