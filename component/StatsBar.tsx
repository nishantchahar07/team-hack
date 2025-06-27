import { StatsBarProps } from "@/types/nurse";
import { StatItem } from "./StatItem";

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => (
  <div className="stats-bar">
    {stats.map((stat) => (
      <StatItem key={stat.id} stat={stat} />
    ))}
  </div>
);