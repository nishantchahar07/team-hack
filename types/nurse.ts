
 export interface Position {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

 export interface MapDot {
  id: number;
  position: Position;
  status: 'en-route' | 'completing' | 'available';
}

 export interface Nurse {
  id: number;
  name: string;
  avatar: string;
  emoji: string;
  eta: number; 
  nextVisit: string;
  status: 'en-route' | 'completing' | 'available';
}

 export interface Stat {
  id: number;
  value: string;
  label: string;
}

 export interface NurseCardProps {
  nurse: Nurse;
  isHovered: boolean;
  onHover: (nurseId: number | null) => void;
}

 export interface MapDotProps {
  dot: MapDot;
  onHover: (dotId: number | null) => void;
}

 export interface StatItemProps {
  stat: Stat;
}

 export interface StatsBarProps {
  stats: Stat[];
}

 export interface MapContainerProps {
  dots: MapDot[];
  onDotHover: (dotId: number | null) => void;
}