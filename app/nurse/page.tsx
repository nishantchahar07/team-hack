'use client'
import { MAP_DOTS_DATA } from '@/component/Mapdot';
import { NurseCard } from '@/component/NurseCard';
import { NURSES_DATA } from '@/component/Nursedata';
import { StatsBar } from '@/component/StatsBar';
import { STATS_DATA } from '@/component/Statsdata';
import { MapContainerProps, type MapDot, MapDotProps, Nurse, Stat } from '@/types/nurse';
import React, { useState, useEffect, useCallback } from 'react';
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
const NurseRouteOptimization: React.FC = () => {
    const [hoveredNurseId, setHoveredNurseId] = useState<number | null>(null);
    const [stats, setStats] = useState<Stat[]>(STATS_DATA);
    const [nurses, setNurses] = useState<Nurse[]>(NURSES_DATA);
    const [mapDots, setMapDots] = useState<MapDot[]>(MAP_DOTS_DATA);

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
        <>
            <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Open Sans', sans-serif;
          background-color: #F5F7FA;
          color: #2C3E50;
          line-height: 1.6;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
          padding: 30px 0;
          background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
          border-radius: 20px;
          color: white;
          box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
        }

        .header h1 {
          font-family: 'Poppins', sans-serif;
          font-size: 2.5rem;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .header p {
          font-size: 1.1rem;
          opacity: 0.9;
          font-weight: 300;
        }

        .map-container {
          background: white;
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }

        .map-header {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          gap: 15px;
        }

        .map-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #1976D2, #42A5F5);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        }

        .map-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: #2C3E50;
        }

        .map-subtitle {
          font-size: 1rem;
          color: #546E7A;
          margin-top: 5px;
        }

        .map-area {
          height: 400px;
          background: linear-gradient(135deg, #E3F2FD 0%, #F1F8E9 100%);
          border-radius: 16px;
          position: relative;
          border: 2px solid #E8F5E8;
        }

        .nurse-dot {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #4CAF50;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
          animation: pulse 2s infinite;
          cursor: pointer;
        }

        .nurse-dot.active {
          background: #FFC107;
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
        }

        .nurse-dot.completed {
          background: #81C784;
          box-shadow: 0 4px 12px rgba(129, 199, 132, 0.4);
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .nurse-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .nurse-card {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border-left: 5px solid #4CAF50;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        .nurse-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #4CAF50, #81C784);
        }

        .nurse-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .nurse-card.completing {
          border-left-color: #FFC107;
          background: linear-gradient(135deg, #FFFDE7 0%, #FFF9C4 100%);
        }

        .nurse-card.completing::before {
          background: linear-gradient(90deg, #FFC107, #FFD54F);
        }

        .nurse-card.available {
          border-left-color: #1976D2;
          background: linear-gradient(135deg, #E3F2FD 0%, #E1F5FE 100%);
        }

        .nurse-card.available::before {
          background: linear-gradient(90deg, #1976D2, #42A5F5);
        }

        .nurse-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .nurse-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4CAF50, #81C784);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
          box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
        }

        .nurse-name {
          font-family: 'Poppins', sans-serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #2C3E50;
          margin-bottom: 5px;
        }

        .nurse-info {
          display: grid;
          gap: 12px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .info-label {
          font-weight: 600;
          color: #546E7A;
          font-size: 0.9rem;
        }

        .info-value {
          font-weight: 500;
          color: #2C3E50;
        }

        .eta-badge {
          background: linear-gradient(135deg, #4CAF50, #81C784);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-align: center;
        }

        .status-en-route {
          background: linear-gradient(135deg, #4CAF50, #81C784);
          color: white;
        }

        .status-completing {
          background: linear-gradient(135deg, #FFC107, #FFD54F);
          color: #2C3E50;
        }

        .status-available {
          background: linear-gradient(135deg, #1976D2, #42A5F5);
          color: white;
        }

        .visit-type {
          background: #F5F7FA;
          padding: 8px 12px;
          border-radius: 12px;
          color: #2C3E50;
          font-weight: 500;
          border: 1px solid #E0E6ED;
        }

        .stats-bar {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin: 30px 0;
          padding: 25px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
        }

        .stat-item {
          text-align: center;
          padding: 0 20px;
        }

        .stat-number {
          font-family: 'Poppins', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #4CAF50;
          margin-bottom: 5px;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #546E7A;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }
          
          .header h1 {
            font-size: 2rem;
          }
          
          .nurse-cards {
            grid-template-columns: 1fr;
          }
          
          .stats-bar {
            flex-direction: column;
            gap: 15px;
          }
          
          .map-area {
            height: 300px;
          }
        }
      `}</style>

            <div className="container">
                <div className="header">
                    <h1>🏥 Nurse Route Optimization</h1>
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
        </>
    );
};

export default NurseRouteOptimization;