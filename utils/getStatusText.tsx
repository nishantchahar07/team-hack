import { Nurse } from "@/types/nurse";

 export const getStatusText = (status: Nurse['status']): string => {
  const statusMap = {
    'en-route': 'En Route',
    'completing': 'Completing Visit',
    'available': 'Available',
  };
  return statusMap[status];
};