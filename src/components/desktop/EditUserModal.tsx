
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  department: string | null;
  avatar_url: string | null;
  created_at: string;
  status?: 'Active' | 'Inactive';
}

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onUserUpdated
}) => {
  const { toast } = useToast();
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    role: '',
    status: 'Active',
    changePassword: false,
    newPassword: '',
    confirmNewPassword: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const departments = [
    'Assembly Line 1',
    'Assembly Line 3', 
    'Maintenance',
    'Quality Control',
    'Operations',
    'Training Department'
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email,
        department: user.department || '',
        role: user.role,
        status: user.status || 'Active',
        changePassword: false,
        newPassword: '',
        confirmNewPassword: ''
      });
      setAvatarPreview(user.avatar_url);
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.department) return 'Department is required';
    if (!formData.role) return 'Role is required';
    
    if (formData.changePassword) {
      if (!formData.newPassword) return 'New password is required';
      if (formData.newPassword !== formData.confirmNewPassword) return 'Passwords do not match';
      if (formData.newPassword.length < 6) return 'Password must be at least 6 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Please enter a valid email address';

    return null;
  };

  const uploadAvatar = async (userId: string, file: File): Promise<string | null> => {
    try {
      // Delete old avatar if it exists
      if (user.avatar_url) {
        const oldFileName = user.avatar_url.split('/').pop();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let avatarUrl = user.avatar_url;

      // Upload new avatar if provided
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(user.id, avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          throw new Error('Failed to upload avatar');
        }
      } else if (avatarPreview === null && user.avatar_url) {
        // Remove avatar if it was removed
        if (user.avatar_url) {
          const oldFileName = user.avatar_url.split('/').pop();
          if (oldFileName && oldFileName !== 'undefined') {
            await supabase.storage
              .from('avatars')
              .remove([`${user.id}/${oldFileName}`]);
          }
        }
        avatarUrl = null;
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          department: formData.department,
          role: formData.role,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update password if requested (Note: This would require admin privileges)
      if (formData.changePassword && formData.newPassword) {
        // Password change functionality would need to be implemented server-side
        toast({
          title: "Note",
          description: "Password change functionality requires additional setup.",
        });
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      // Refresh current user's profile if they updated their own profile
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser?.id === user.id) {
        await refreshProfile();
      }

      onUserUpdated();
      onClose();

    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit User - {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">Photo</span>
                )}
              </div>
              <div className="flex-1 space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  id="avatar-upload-edit"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('avatar-upload-edit')?.click()}
                >
                  Change Photo
                </Button>
                {avatarPreview && (
                  <Button type="button" variant="outline" size="sm" onClick={removeAvatar}>
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              required
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label>Department *</Label>
            <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
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

          {/* Role */}
          <div className="space-y-2">
            <Label>Role *</Label>
            <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Operator">Operator</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Change Password Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="changePassword"
                checked={formData.changePassword}
                onChange={(e) => handleInputChange('changePassword', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="changePassword">Change Password</Label>
            </div>
          </div>

          {formData.changePassword && (
            <>
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  required={formData.changePassword}
                />
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password *</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={formData.confirmNewPassword}
                  onChange={(e) => handleInputChange('confirmNewPassword', e.target.value)}
                  required={formData.changePassword}
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#3a7ca5] hover:bg-[#2f6690] text-white"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
