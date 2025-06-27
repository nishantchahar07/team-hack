import { StatItemProps } from "@/types/nurse";

 export const StatItem: React.FC<StatItemProps> = ({ stat }) => (
  <div className="stat-item">
    <div className="stat-number">{stat.value}</div>
    <div className="stat-label">{stat.label}</div>
  </div>
);