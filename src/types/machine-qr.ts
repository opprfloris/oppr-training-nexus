
export interface MachineQREntity {
  id: string;
  machine_id: string;
  qr_identifier: string;
  qr_name: string;
  machine_type: string | null;
  location_description: string | null;
  brand: string | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface MachineQRCreateData {
  machine_id: string;
  qr_name: string;
  machine_type?: string;
  location_description?: string;
  brand?: string;
}

export interface MachineQRUpdateData {
  machine_id?: string;
  qr_name?: string;
  machine_type?: string;
  location_description?: string;
  brand?: string;
}
