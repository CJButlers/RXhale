export interface VitalsLog {
  date: string;      // e.g., "2024-03-20"
  time: string;      // e.g., "14:30"
  bpm: number;       // Heart Rate
  spO2: number;      // Oxygen Saturation
  status?: 'Normal' | 'Warning' | 'Critical'; 
}

export interface SymptomLog {
  date: string;
  time: string;
  description: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age?: number;
  phn: string;
  phoneNumber: string;
  sex?: string; // We added this in the AddPatientPage step
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  // Medical Info
  previousAppointments: string;
  diagnosis: string;
  medication: string;
  history: string;
  
  // Dynamic Data
  symptoms: SymptomLog[];
  vitals: VitalsLog[]; 
  notes: string;
  pharmacyCode?: string;
}

export interface UserCredentials {
  username: string;
  password: string;
  name: string;
}