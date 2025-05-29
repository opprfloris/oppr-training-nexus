
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface MachineQREntity {
  id: string;
  machine_id: string;
  qr_identifier: string;
  qr_name: string;
  machine_type: string | null;
  brand: string | null;
  location_description: string | null;
}

interface MachineSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMachineSelect: (machine: MachineQREntity) => void;
}

const MachineSelectionModal: React.FC<MachineSelectionModalProps> = ({
  isOpen,
  onClose,
  onMachineSelect
}) => {
  const [machines, setMachines] = useState<MachineQREntity[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<MachineQREntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof MachineQREntity>('qr_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadMachines();
    }
  }, [isOpen]);

  useEffect(() => {
    filterAndSortMachines();
  }, [machines, searchTerm, sortField, sortDirection]);

  const loadMachines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('machine_qr_entities')
        .select('*')
        .order('qr_name', { ascending: true });

      if (error) throw error;
      setMachines(data || []);
    } catch (error) {
      console.error('Error loading machines:', error);
      toast({
        title: "Error",
        description: "Failed to load machines",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMachines = () => {
    let filtered = machines.filter(machine =>
      machine.qr_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.qr_identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.machine_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (machine.machine_type?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (machine.brand?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (machine.location_description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      const comparison = aValue.toString().localeCompare(bValue.toString());
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredMachines(filtered);
  };

  const handleSort = (field: keyof MachineQREntity) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleMachineSelect = (machine: MachineQREntity) => {
    onMachineSelect(machine);
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Select Machine/QR</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search machines, QR codes, types, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredMachines.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No machines found matching your search.</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('qr_name')}
                    >
                      QR Name {sortField === 'qr_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('qr_identifier')}
                    >
                      QR Identifier {sortField === 'qr_identifier' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('machine_id')}
                    >
                      Machine ID {sortField === 'machine_id' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('machine_type')}
                    >
                      Type {sortField === 'machine_type' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('brand')}
                    >
                      Brand {sortField === 'brand' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMachines.map((machine) => (
                    <tr key={machine.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {machine.qr_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {machine.qr_identifier}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {machine.machine_id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {machine.machine_type || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {machine.brand || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Button
                          size="sm"
                          onClick={() => handleMachineSelect(machine)}
                          className="bg-oppr-blue hover:bg-oppr-blue/90"
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MachineSelectionModal;
