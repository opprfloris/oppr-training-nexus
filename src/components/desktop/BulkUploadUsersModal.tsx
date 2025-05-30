
import React, { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BulkUploadUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUsersCreated: () => void;
}

interface CSVUserRow {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  department: string;
  password: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export const BulkUploadUsersModal: React.FC<BulkUploadUsersModalProps> = ({
  isOpen,
  onClose,
  onUsersCreated,
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVUserRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const departments = [
    'Assembly Line 1',
    'Assembly Line 3', 
    'Maintenance',
    'Quality Control',
    'Operations',
    'Training Department'
  ];

  const downloadTemplate = () => {
    const csvContent = [
      'first_name,last_name,email,role,department,password',
      'John,Doe,john.doe@company.com,Operator,Assembly Line 1,TempPass123!',
      'Jane,Smith,jane.smith@company.com,Manager,Operations,TempPass456!',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'bulk_users_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const parseCSV = (text: string): CSVUserRow[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
  };

  const validateCSVData = (data: CSVUserRow[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    const emails = new Set<string>();

    data.forEach((row, index) => {
      // Check required fields
      if (!row.first_name) {
        errors.push({ row: index + 2, field: 'first_name', message: 'First name is required' });
      }
      if (!row.last_name) {
        errors.push({ row: index + 2, field: 'last_name', message: 'Last name is required' });
      }
      if (!row.email) {
        errors.push({ row: index + 2, field: 'email', message: 'Email is required' });
      }
      if (!row.role) {
        errors.push({ row: index + 2, field: 'role', message: 'Role is required' });
      }
      if (!row.department) {
        errors.push({ row: index + 2, field: 'department', message: 'Department is required' });
      }
      if (!row.password) {
        errors.push({ row: index + 2, field: 'password', message: 'Password is required' });
      }

      // Check email format
      if (row.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row.email)) {
          errors.push({ row: index + 2, field: 'email', message: 'Invalid email format' });
        }

        // Check for duplicate emails
        if (emails.has(row.email)) {
          errors.push({ row: index + 2, field: 'email', message: 'Duplicate email' });
        }
        emails.add(row.email);
      }

      // Check role values
      if (row.role && !['Operator', 'Manager'].includes(row.role)) {
        errors.push({ row: index + 2, field: 'role', message: 'Role must be either "Operator" or "Manager"' });
      }

      // Check department values
      if (row.department && !departments.includes(row.department)) {
        errors.push({ row: index + 2, field: 'department', message: 'Invalid department' });
      }

      // Check password strength
      if (row.password && row.password.length < 6) {
        errors.push({ row: index + 2, field: 'password', message: 'Password must be at least 6 characters' });
      }
    });

    return errors;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const parsedData = parseCSV(text);
        setCsvData(parsedData);
        
        const errors = validateCSVData(parsedData);
        setValidationErrors(errors);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (validationErrors.length > 0) return;

    setIsProcessing(true);
    setProgress(0);

    const validData = csvData.filter(row => 
      row.first_name && row.last_name && row.email && row.role && row.department && row.password
    );
    
    try {
      let successCount = 0;
      let errorCount = 0;

      // Process users in batches
      const batchSize = 5;
      for (let i = 0; i < validData.length; i += batchSize) {
        const batch = validData.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (userData) => {
          try {
            // Create user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
              email: userData.email,
              password: userData.password,
              user_metadata: {
                first_name: userData.first_name,
                last_name: userData.last_name,
                role: userData.role,
              },
              email_confirm: true // Auto-confirm email for bulk uploads
            });

            if (authError) throw authError;

            if (authData.user) {
              // Update profile with additional information
              const { error: profileError } = await supabase
                .from('profiles')
                .update({
                  first_name: userData.first_name,
                  last_name: userData.last_name,
                  role: userData.role,
                  department: userData.department,
                })
                .eq('id', authData.user.id);

              if (profileError) {
                console.error('Profile update error:', profileError);
                // Don't throw here as the user is already created
              }
            }

            successCount++;
            return true;
          } catch (error) {
            console.error('Error creating user:', error);
            errorCount++;
            return false;
          }
        });

        await Promise.all(batchPromises);
        
        // Update progress
        const currentProgress = Math.round(((i + batchSize) / validData.length) * 100);
        setProgress(Math.min(currentProgress, 100));
      }

      if (errorCount === 0) {
        toast({
          title: 'Success',
          description: `Bulk upload complete: ${successCount} users created successfully`,
        });
      } else {
        toast({
          title: 'Partial Success',
          description: `${successCount} users created, ${errorCount} failed`,
          variant: 'destructive',
        });
      }

      if (successCount > 0) {
        setUploadComplete(true);
        onUsersCreated();
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Bulk upload failed:', error);
      toast({
        title: 'Error',
        description: 'Bulk upload failed',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setCsvData([]);
    setValidationErrors([]);
    setIsProcessing(false);
    setProgress(0);
    setUploadComplete(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Upload Users</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h4 className="font-medium">Download CSV Template</h4>
              <p className="text-sm text-gray-600">Get the proper format for your user data</p>
            </div>
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div>
              <label htmlFor="csv-file" className="block text-sm font-medium mb-2">
                Upload CSV File
              </label>
              <input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {file && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm">File loaded: {file.name} ({csvData.length} rows)</span>
                </div>
              </div>
            )}
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Validation Errors Found:</p>
                  {validationErrors.slice(0, 5).map((error, index) => (
                    <p key={index} className="text-sm">
                      Row {error.row}: {error.field} - {error.message}
                    </p>
                  ))}
                  {validationErrors.length > 5 && (
                    <p className="text-sm">...and {validationErrors.length - 5} more errors</p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Creating users...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Success Message */}
          {uploadComplete && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Successfully created {csvData.length} users!
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!file || validationErrors.length > 0 || isProcessing || uploadComplete}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload {csvData.length} Users
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
