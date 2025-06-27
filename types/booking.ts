import { Bell, Calendar, Clock, Home, LucideIcon, MapPin, TrendingUp, User } from "lucide-react";

export interface FormData {
  name: string;
  date: string;
  time: string;
}

export interface Notification {
  id: number;
  title: string;
  time: string;
  type: 'arrival' | 'medicine' | 'checkup';
}

export interface Step {
  id: number;
  title: string;
  icon: LucideIcon;
  active: boolean;
}

export interface NavigationItem {
  icon: LucideIcon;
  label: string;
  color: string;
}

export interface TimeSlot {
  value: string;
  label: string;
}


export const TIME_SLOTS: TimeSlot[] = [
  { value: '09:00', label: '09:00 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '14:00', label: '02:00 PM' },
  { value: '15:00', label: '03:00 PM' },
  { value: '16:00', label: '04:00 PM' },
];

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { icon: Home, label: 'Home', color: '#1976D2' },
  { icon: Calendar, label: 'Calendar', color: '#1976D2' },
  { icon: MapPin, label: 'Location', color: '#1976D2' },
  { icon: TrendingUp, label: 'Analytics', color: '#1976D2' },
];

export const BOTTOM_NAVIGATION: NavigationItem[] = [
  { icon: Calendar, label: 'Calendar', color: '#1976D2' },
  { icon: Clock, label: 'Schedule', color: '#4CAF50' },
  { icon: User, label: 'Profile', color: '#81C784' },
  { icon: Bell, label: 'Alerts', color: '#FFC107' },
];

 export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'Nurse arriving in 15 minutes',
    time: '2:45 PM',
    type: 'arrival'
  },
  {
    id: 2,
    title: 'Take evening medicine',
    time: '6:00 PM',
    type: 'medicine'
  },
  {
    id: 3,
    title: 'Tele check-up scheduled',
    time: 'Tomorrow 10 AM',
    type: 'checkup'
  }
];


export interface InputFieldProps {
  type: 'text' | 'date';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  icon?: LucideIcon;
}

export interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: TimeSlot[];
  placeholder: string;
}

export interface NavigationButtonProps {
  item: NavigationItem;
  onClick?: () => void;
}

export interface NotificationCardProps {
  notification: Notification;
  onDismiss: (id: number) => void;
}

export interface StepIndicatorProps {
  steps: Step[];
}

export interface FormStepProps {
  currentStep: number;
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
}
