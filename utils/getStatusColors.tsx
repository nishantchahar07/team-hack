import { Nurse } from "@/types/nurse";

 export const getStatusColors = (status: Nurse['status']) => {
  const colorMap = {
    'en-route': {
      gradient: 'linear-gradient(135deg, #4CAF50, #81C784)',
      borderColor: '#4CAF50',
      backgroundColor: 'transparent',
      avatarShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
    },
    'completing': {
      gradient: 'linear-gradient(135deg, #FFC107, #FFD54F)',
      borderColor: '#FFC107',
      backgroundColor: 'linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%)',
      avatarShadow: '0 4px 16px rgba(255, 193, 7, 0.3)',
    },
    'available': {
      gradient: 'linear-gradient(135deg, #1976D2, #42A5F5)',
      borderColor: '#1976D2',
      backgroundColor: 'linear-gradient(135deg, #E3F2FD 0%, #E1F5FE 100%)',
      avatarShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
    },
  };
  return colorMap[status];
};