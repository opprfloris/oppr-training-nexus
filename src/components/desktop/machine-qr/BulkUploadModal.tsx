
import React, { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MachineQRCreateData } from '@/types/machine-qr';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkCreate: (entities: MachineQRCreateData[]) => Promise<boolean>;
}

interface CSVRow {
  machine_id: string;
  qr_name: string;
  machine_type?: string;
  location_description?: string;
  brand?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onBulkCreate,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const downloadTemplate = () => {
    const csvContent = [
      'machine_id,qr_name,machine_type,location_description,brand',
      'PUMP-001,Main Water Pump,Pump,Factory Floor - Section A,AquaTech',
      'CONV-002,Belt Conveyor 2,Conveyor,Warehouse - Line B,ConveyorCorp',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'machine_qr_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const parseCSV = (text: string): CSVRow[] => {
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

  const validateCSVData = (data: CSVRow[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    const machineIds = new Set<string>();

    data.forEach((row, index) => {
      // Check required fields
      if (!row.machine_id) {
        errors.push({ row: index + 2, field: 'machine_id', message: 'Machine ID is required' });
      }
      if (!row.qr_name) {
        errors.push({ row: index + 2, field: 'qr_name', message: 'QR Name is required' });
      }

      // Check for duplicate machine IDs
      if (row.machine_id) {
        if (machineIds.has(row.machine_id)) {
          errors.push({ row: index + 2, field: 'machine_id', message: 'Duplicate Machine ID' });
        }
        machineIds.add(row.machine_id);
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

    const validData = csvData.filter(row => row.machine_id && row.qr_name);
    
    try {
      const success = await onBulkCreate(validData);
      
      if (success) {
        setProgress(100);
        setUploadComplete(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Bulk upload failed:', error);
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
          <DialogTitle>Bulk Upload Machines & QR Entities</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <h4 className="font-medium">Download CSV Template</h4>
              <p className="text-sm text-gray-600">Get the proper format for your data</p>
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
                <span>Uploading entities...</span>
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
                Successfully uploaded {csvData.length} machine QR entities!
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
              Upload {csvData.length} Entities
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
