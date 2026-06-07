import type { Story } from '../../data/stories';
import { WARP_COLORS } from '../../data/colors';

interface StoryCardProps {
  story: Story;
  onClose: () => void;
}

export function StoryCard({ story, onClose }: StoryCardProps) {
  const warpConfig = WARP_COLORS.find(w => w.id === story.relatedWarp);
  const color = warpConfig?.color || '#fff';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 800,
      background: 'rgba(26,26,46,0.8)',
      backdropFilter: 'blur(6px)',
      animation: 'fadeIn 0.4s ease-out',
    }}>
      <div style={{
        maxWidth: 520,
        width: '90%',
        background: `linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)`,
        borderRadius: 16,
        padding: '48px 40px',
        position: 'relative',
        border: `1px solid ${color}30`,
        boxShadow: `0 0 60px ${color}15`,
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          borderRadius: '16px 16px 0 0',
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 24,
        }}>
          <span style={{
            display: 'inline-block',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: color,
          }} />
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
            {warpConfig?.label} · {story.location}
          </span>
        </div>

        <h2 style={{
          color: '#fff',
          fontSize: 24,
          fontWeight: 300,
          marginBottom: 20,
          letterSpacing: 1,
        }}>
          {story.title}
        </h2>

        <blockquote style={{
          borderLeft: `3px solid ${color}`,
          paddingLeft: 16,
          margin: '0 0 24px 0',
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.8)',
          fontSize: 15,
          lineHeight: 1.8,
        }}>
          {story.quote}
        </blockquote>

        <p style={{
          color: 'rgba(255,255,255,0.65)',
          fontSize: 14,
          lineHeight: 2,
          marginBottom: 32,
        }}>
          {story.body}
        </p>

        <button
          onClick={onClose}
          style={{
            background: `${color}20`,
            border: `1px solid ${color}50`,
            color: color,
            padding: '10px 28px',
            borderRadius: 24,
            cursor: 'pointer',
            fontSize: 14,
            letterSpacing: 2,
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = `${color}40`;
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = `${color}20`;
          }}
        >
          继续编织
        </button>
      </div>
    </div>
  );
}
