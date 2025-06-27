import { MapDot } from "@/types/nurse";

 export const MAP_DOTS_DATA: MapDot[] = [
  {
    id: 1,
    position: { top: '25%', left: '30%' },
    status: 'en-route',
  },
  {
    id: 2,
    position: { top: '60%', right: '20%' },
    status: 'completing',
  },
  {
    id: 3,
    position: { bottom: '30%', right: '15%' },
    status: 'available',
  },
];