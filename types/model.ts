export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  age?: number | null;
  gender?: Gender | null;
  height?: number | null;
  weight?: number | null;
  phone?: string | null;
  verifyCode?: string | null;
  verified: boolean;
  patientProfile?: PatientProfile | null;
  bookings: Booking[];
  createdAt: Date;
  updatedAt: Date;
  SymptomLog: SymptomLog[];
  ModelTrainingData: ModelTrainingData[];
};

export type Nurse = {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  language: string;
  gender: Gender;
  phone: string;
  email: string;
  available: boolean;
  bookings: Booking[];
  createdAt: Date;
  updatedAt: Date;
  Location?: Location | null;
  locationId?: string | null;
};

export type Location = {
  id: string;
  lat: number;
  lng: number;
  address: string;
  nurse: Nurse[];
};

export type Booking = {
  id: string;
  userId: string;
  nurseId: string;
  disease: string;
  scheduledDate: Date;
  status: BookingStatus;
  reason?: string | null;
  nurseFeedback?: string | null;
  user: User;
  nurse: Nurse;
  reports: HealthReport[];
  createdAt: Date;
  updatedAt: Date;
};

export type HealthReport = {
  id: string;
  bookingId: string;
  visitDate: Date;
  notes: string;
  vitals: Json;
  recoveryScore: number;
  booking: Booking;
  createdAt: Date;
};

export type PatientProfile = {
  id: string;
  userId: string;
  medicalHistory: string[];
  currentMedications: string[];
  comorbidities: string[];
  allergies: string[];
  preferredLanguage: Language;
  priorDiagnosis: boolean;
  createdAt: Date;
  user: User;
};

export type SymptomLog = {
  id: string;
  userId: string;
  logDate: Date;
  symptoms: string[];
  painLevel: number;
  energyLevel?: number | null;
  mood?: string | null;
  user: User;
};

export type ModelTrainingData = {
  id: string;
  userId: string;
  nurseId: string;
  disease: string;
  durationMonths: number;
  symptoms: string[];
  painLevel: number;
  priorDiagnosis: boolean;
  comorbidity?: string | null;
  preferredLanguage: Language;
  createdAt: Date;
  user: User;
};

export type Json = any;

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export type Language = 'ENGLISH' | 'HINDI';

export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';

export type LocationCreateInput = {
  lat: number;
  lng: number;
  address: string;
};

export type BookingCreateInput = {
  userId: string;
  nurseId: string;
  disease: string;
  scheduledDate: Date;
  status?: BookingStatus;
  reason?: string;
  nurseFeedback?: string;
};

export type NurseCreateInput = {
  name: string;
  specialization: string;
  experienceYears: number;
  language: string;
  gender: Gender;
  phone: string;
  email: string;
  available: boolean;
  location?: LocationCreateInput;
};

export type PatientProfileCreateInput = {
  userId: string;
  medicalHistory: string[];
  currentMedications: string[];
  comorbidities: string[];
  allergies: string[];
  preferredLanguage: Language;
  priorDiagnosis: boolean;
};

export type SymptomLogCreateInput = {
  userId: string;
  logDate: Date;
  symptoms: string[];
  painLevel: number;
  energyLevel?: number;
  mood?: string;
};

export type HealthReportCreateInput = {
  bookingId: string;
  visitDate: Date;
  notes: string;
  vitals: Json;
  recoveryScore: number;
};
