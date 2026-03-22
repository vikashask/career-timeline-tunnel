import { useEffect, useCallback } from 'react';
import useTimelineStore from '../store/useTimelineStore';

export default function DetailOverlay() {
  const activePortal = useTimelineStore((s) => s.activePortal);
  const isDetailView = useTimelineStore((s) => s.isDetailView);
  const exitPortal = useTimelineStore((s) => s.exitPortal);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isDetailView) {
        exitPortal();
      }
    },
    [isDetailView, exitPortal]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isDetailView || !activePortal) return null;

  const color = activePortal.color;

  return (
    <div
      id="detail-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(20px)' }}
    >
      <div
        className="relative w-full max-w-3xl mx-4 my-8 rounded-3xl border animate-fadeIn"
        style={{
          background: 'linear-gradient(135deg, rgba(10,15,30,0.97) 0%, rgba(5,8,20,0.97) 100%)',
          borderColor: color + '30',
          boxShadow: `0 0 80px ${color}18, 0 0 160px ${color}08, inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        {/* Decorative top glow bar */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />

        {/* Close button */}
        <button
          id="close-detail"
          onClick={exitPortal}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer text-base z-10"
          title="Close (ESC)"
        >
          ✕
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="mb-7 pb-5" style={{ borderBottom: `1px solid ${color}20` }}>
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}
              >
                {activePortal.icon || '📍'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h2
                    className="text-4xl font-black"
                    style={{ fontFamily: 'Orbitron, sans-serif', color }}
                  >
                    {String(activePortal.year)}
                  </h2>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium tracking-wider"
                    style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
                  >
                    {activePortal.period}
                  </span>
                </div>

                <h3 className="text-white text-lg font-semibold leading-tight">{activePortal.role}</h3>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/50 text-sm">{activePortal.company}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-white/40 text-sm">{activePortal.location}</span>
                </div>
              </div>
            </div>

            {/* Tech stack pills */}
            {activePortal.tech && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {activePortal.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full font-mono"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.5)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* P → D → O → W cards */}
          <div className="grid grid-cols-1 gap-3 mb-5">
            {[
              { label: 'Problem', icon: '⚡', value: activePortal.problem, accent: '#ef4444' },
              { label: 'Decision', icon: '🎯', value: activePortal.decision, accent: '#3b82f6' },
              { label: 'Outcome', icon: '🚀', value: activePortal.outcome, accent: '#10b981' },
              { label: 'Why', icon: '💡', value: activePortal.why, accent: color },
            ].map((item, i) => (
              <div
                key={item.label}
                className="p-4 rounded-2xl animate-slideUp"
                style={{
                  background: `${item.accent}07`,
                  border: `1px solid ${item.accent}15`,
                  animationDelay: `${i * 80}ms`,
                  animationFillMode: 'backwards',
                }}
              >
                <div
                  className="text-xs font-bold tracking-widest uppercase mb-1.5 flex items-center gap-2"
                  style={{ color: item.accent }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Highlights */}
          {activePortal.highlights && activePortal.highlights.length > 0 && (
            <div
              className="p-4 rounded-2xl animate-slideUp"
              style={{
                background: `${color}05`,
                border: `1px solid ${color}12`,
                animationDelay: '320ms',
                animationFillMode: 'backwards',
              }}
            >
              <div
                className="text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2"
                style={{ color }}
              >
                <span>✨</span> Key Highlights
              </div>
              <ul className="space-y-1.5">
                {activePortal.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span style={{ color, marginTop: '2px' }}>›</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between">
            <div className="text-white/20 text-xs tracking-wider">Press ESC or click ✕ to return</div>
            <div className="text-white/20 text-xs">vikashraj144@gmail.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
