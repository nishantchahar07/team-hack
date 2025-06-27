import { Nurse } from "@/types/nurse";

 export const NURSES_DATA: Nurse[] = [
  {
    id: 1,
    name: 'Nurse Priya',
    avatar: 'P',
    emoji: '👩‍⚕',
    eta: 15,
    nextVisit: 'Diabetes Check',
    status: 'en-route',
  },
  {
    id: 2,
    name: 'Nurse Rahul',
    avatar: 'R',
    emoji: '👨‍⚕',
    eta: 28,
    nextVisit: 'Post-Surgery Care',
    status: 'completing',
  },
  {
    id: 3,
    name: 'Nurse Anjali',
    avatar: 'A',
    emoji: '👩‍⚕',
    eta: 45,
    nextVisit: 'BP Monitoring',
    status: 'available',
  },
];