'use client'
import { MAP_DOTS_DATA } from '@/component/Mapdot';
import { NurseCard } from '@/component/NurseCard';
import { NURSES_DATA } from '@/component/Nursedata';
import { StatsBar } from '@/component/StatsBar';
import { STATS_DATA } from '@/component/Statsdata';
import { MapContainerProps, type MapDot, MapDotProps, Nurse, Stat } from '@/types/nurse';
import React, { useState, useEffect, useCallback } from 'react';
import NurseStyles from './nurseStyle';

const MapDot: React.FC<MapDotProps> = ({ dot, onHover }) => {

  const getDotClassName = (status: MapDot['status']): string => {
    const baseClass = 'nurse-dot';
    const statusClass = status === 'completing' ? 'active' : status === 'available' ? 'completed' : '';
    return `${baseClass} ${statusClass}`.trim();
  };

  const handleMouseEnter = useCallback(() => {
    onHover(dot.id);
  }, [dot.id, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
  }, [onHover]);

  return (
    <div
      className={getDotClassName(dot.status)}
      style={dot.position}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

const NurseRouteOptimization: React.FC = () => {

  const [hoveredNurseId, setHoveredNurseId] = useState<number | null>(null);
  const [stats] = useState<Stat[]>(STATS_DATA);
  const [nurses, setNurses] = useState<Nurse[]>(NURSES_DATA);
  const [mapDots] = useState<MapDot[]>(MAP_DOTS_DATA);

  const handleNurseHover = useCallback((nurseId: number | null) => {
    setHoveredNurseId(nurseId);
  }, []);

  const handleDotHover = useCallback((dotId: number | null) => {
    setHoveredNurseId(dotId);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setNurses(prevNurses =>
        prevNurses.map(nurse => ({
          ...nurse,
          eta: Math.max(1, nurse.eta - 1),
        }))
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <NurseStyles />

      <div className="container">
        <div className="header">
          <h1> Nurse Route Optimization</h1>
          <p>Intelligent healthcare delivery system with real-time tracking</p>
        </div>

        <StatsBar stats={stats} />

        <MapContainer dots={mapDots} onDotHover={handleDotHover} />

        <div className="nurse-cards">
          {nurses.map((nurse) => (
            <NurseCard
              key={nurse.id}
              nurse={nurse}
              isHovered={hoveredNurseId === nurse.id}
              onHover={handleNurseHover}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MapContainer: React.FC<MapContainerProps> = ({ dots, onDotHover }) => (
  <div className="map-container">
    <div className="map-header">
      <div className="map-icon">🗺</div>
      <div>
        <div className="map-title">Live GPS Tracking</div>
        <div className="map-subtitle">Real-time nurse locations and optimized routes</div>
      </div>
    </div>
    <div className="map-area">
      {dots.map((dot) => (
        <MapDot key={dot.id} dot={dot} onHover={onDotHover} />
      ))}
    </div>
  </div>
);

export default NurseRouteOptimization;