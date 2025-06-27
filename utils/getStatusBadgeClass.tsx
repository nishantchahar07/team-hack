import { Nurse } from "@/types/nurse";

export const getStatusBadgeClass = (status: Nurse['status']): string => {
  const classMap = {
    'en-route': 'status-en-route',
    'completing': 'status-completing',
    'available': 'status-available',
  };
  return classMap[status];
};