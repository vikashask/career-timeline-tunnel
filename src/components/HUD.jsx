import { useMemo } from 'react';
import useTimelineStore from '../store/useTimelineStore';
import { timelineData, TUNNEL_LENGTH, PROFILE } from '../data/timelineData';
import profileImg from '../assets/profile img mini.jpeg';

export default function HUD() {
  const cameraZ = useTimelineStore((s) => s.cameraZ);
  const isDetailView = useTimelineStore((s) => s.isDetailView);
  const hoveredPortal = useTimelineStore((s) => s.hoveredPortal);

  const progress = useMemo(() => {
    return Math.min(100, Math.max(0, (Math.abs(cameraZ) / (TUNNEL_LENGTH - 15)) * 100));
  }, [cameraZ]);

  // Find nearest year
  const nearestEntry = useMemo(() => {
    let closest = timelineData[0];
    let minDist = Infinity;
    for (const entry of timelineData) {
      const dist = Math.abs(cameraZ - entry.zPosition);
      if (dist < minDist) {
        minDist = dist;
        closest = entry;
      }
    }
    return minDist < 12 ? closest : null;
  }, [cameraZ]);

  if (isDetailView) return null;

  return (
    <div id="hud" className="fixed inset-0 z-40 pointer-events-none">
      {/* Gradient progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #7c3aed, #0ea5e9, #c026d3, #10b981)',
          }}
        />
      </div>

      {/* Top left — profile image + name + title */}
      <div className="absolute top-5 left-6 flex items-center gap-3">
        {/* Profile image with cosmic glow */}
        <div className="profile-avatar-ring">
          <img
            src={profileImg}
            alt={PROFILE.name}
            className="w-11 h-11 rounded-full object-cover"
            style={{
              border: '2px solid rgba(124, 58, 237, 0.6)',
            }}
          />
        </div>

        <div>
          <h1
            className="text-base font-bold tracking-widest text-white/90"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            {PROFILE.name.toUpperCase()}
          </h1>
          <p className="text-xs text-white/40 tracking-wider mt-0.5">{PROFILE.title} · {PROFILE.experience}</p>
        </div>
      </div>

      {/* Top right — progress */}
      <div className="absolute top-5 right-6 text-right">
        <div
          className="text-xs font-semibold tracking-widest"
          style={{ fontFamily: 'Orbitron, sans-serif', color: nearestEntry?.color || '#7c3aed' }}
        >
          {nearestEntry ? String(nearestEntry.year) : '—'}
        </div>
        <div className="text-xs text-white/30 mt-0.5 tracking-wider">
          {Math.round(progress)}% explored
        </div>
      </div>

      {/* Navigation dots on the right side */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {timelineData.map((entry) => {
          const entryProgress = Math.abs(entry.zPosition) / (TUNNEL_LENGTH - 15);
          const camProgress = Math.abs(cameraZ) / (TUNNEL_LENGTH - 15);
          const isNear = Math.abs(entryProgress - camProgress) < 0.1;
          return (
            <div
              key={entry.year}
              className="group flex items-center justify-end gap-2"
              title={String(entry.year)}
            >
              <div className="text-xs text-white/0 group-hover:text-white/50 transition-all tracking-wide" style={{ fontSize: '10px' }}>
                {entry.year}
              </div>
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: isNear ? '8px' : '4px',
                  height: isNear ? '8px' : '4px',
                  background: isNear ? entry.color : 'rgba(255,255,255,0.2)',
                  boxShadow: isNear ? `0 0 8px ${entry.color}` : 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Near portal indicator */}
      {nearestEntry && (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
          <div
            className="text-7xl font-black opacity-[0.06]"
            style={{ fontFamily: 'Orbitron, sans-serif', color: nearestEntry.color, lineHeight: 1 }}
          >
            {String(nearestEntry.year)}
          </div>
          <div className="text-xs text-white/10 mt-1 tracking-widest">
            {nearestEntry.company.toUpperCase()}
          </div>
        </div>
      )}

      {/* Hovered portal tooltip */}
      {hoveredPortal && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-none animate-fadeIn flex flex-col items-center">
          <div
            className="px-6 py-4 rounded-2xl border mb-3 flex flex-col gap-2 min-w-[300px]"
            style={{
              background: 'rgba(5,10,20,0.92)',
              borderColor: `${hoveredPortal.color}50`,
              boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 20px ${hoveredPortal.color}20`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center justify-between border-b pb-2 mb-1" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <span className="text-sm font-bold tracking-widest uppercase" style={{ color: hoveredPortal.color }}>
                {hoveredPortal.company}
              </span>
              <span className="text-xs text-white/40 tracking-wider bg-white/5 px-2 py-0.5 rounded-full">
                {hoveredPortal.year}
              </span>
            </div>
            
            <div className="text-white/90 font-medium text-[15px] leading-tight mb-1">
              {hoveredPortal.role}
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-1">
              {hoveredPortal.tech?.slice(0, 4).map((tech, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10 tracking-wider">
                  {tech}
                </span>
              ))}
              {hoveredPortal.tech?.length > 4 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5 tracking-wider">
                  +{hoveredPortal.tech.length - 4}
                </span>
              )}
            </div>
          </div>
          
          <div
            className="px-5 py-1.5 rounded-full text-[11px] tracking-[0.2em] uppercase border"
            style={{
              background: `linear-gradient(90deg, transparent, ${hoveredPortal.color}15, transparent)`,
              borderColor: `${hoveredPortal.color}30`,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            Click to explore →
          </div>
        </div>
      )}

      {/* Bottom — scroll hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center">
        <div className="text-white/20 text-xs tracking-[0.3em] uppercase animate-pulse">
          Scroll to travel through the universe
        </div>
        <div className="mt-2 flex justify-center">
          <div className="w-5 h-8 rounded-full border border-white/15 flex justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-white/30 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Skills marquee at very bottom */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden h-6 border-t border-white/[0.04]">
        <div
          className="flex items-center gap-8 text-white/15 text-[10px] tracking-wider h-full pl-4 whitespace-nowrap"
          style={{ animation: 'marquee 30s linear infinite' }}
        >
          {[...PROFILE.skills.frontend, ...PROFILE.skills.backend, ...PROFILE.skills.devops, ...PROFILE.skills.databases].map((s, i) => (
            <span key={i}>{s}</span>
          ))}
          {[...PROFILE.skills.frontend, ...PROFILE.skills.backend].map((s, i) => (
            <span key={`r-${i}`}>{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
