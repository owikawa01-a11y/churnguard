import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'RetainPulse — Stop losing customers silently';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          background: '#05050c',
          position: 'relative',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* ─── Background gradient orbs ─── */}
        <div
          style={{
            position: 'absolute',
            top: '-300px',
            left: '-200px',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 60%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-300px',
            right: '-100px',
            width: '900px',
            height: '900px',
            background: 'radial-gradient(circle, rgba(217,70,239,0.35) 0%, transparent 60%)',
            display: 'flex',
          }}
        />

        {/* ─── Grid pattern ─── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            display: 'flex',
          }}
        />

        {/* ─── Left side: Text content ─── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px',
            paddingRight: '40px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '48px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 40px rgba(139,92,246,0.5)',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12h3l2-7 4 14 2-7h7" />
              </svg>
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ffffff',
                letterSpacing: '-0.02em',
                display: 'flex',
              }}
            >
              Retain
              <span style={{ color: '#a78bfa' }}>Pulse</span>
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: '1.05',
              letterSpacing: '-0.03em',
              marginBottom: '8px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Stop losing</span>
            <span>customers</span>
          </div>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#a78bfa',
              lineHeight: '1.05',
              letterSpacing: '-0.03em',
              display: 'flex',
            }}
          >
            silently.
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 20px',
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.35)',
              borderRadius: '100px',
              marginTop: '48px',
              alignSelf: 'flex-start',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#a78bfa',
                display: 'flex',
              }}
            />
            <div
              style={{
                fontSize: '16px',
                color: '#c4b5fd',
                fontWeight: '600',
                letterSpacing: '0.08em',
                display: 'flex',
              }}
            >
              FOUNDING MEMBERS · 5 SPOTS
            </div>
          </div>
        </div>

        {/* ─── Right side: Big pulse graphic ─── */}
        <div
          style={{
            width: '480px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
            paddingRight: '60px',
          }}
        >
          {/* Glow behind pulse */}
          <div
            style={{
              position: 'absolute',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 65%)',
              display: 'flex',
            }}
          />

          {/* Big pulse line */}
          <svg
            width="440"
            height="200"
            viewBox="0 0 440 200"
            style={{ position: 'relative' }}
          >
            <defs>
              <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
              <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M 10 100 L 90 100 L 130 30 L 180 170 L 220 60 L 260 130 L 300 100 L 430 100"
              stroke="url(#pulseGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#pulseGlow)"
            />
          </svg>
        </div>

        {/* ─── Bottom URL bar ─── */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '80px',
            fontSize: '18px',
            color: '#475569',
            fontWeight: '600',
            letterSpacing: '0.05em',
            display: 'flex',
            zIndex: 3,
          }}
        >
          retainpulse.pro
        </div>

        {/* ─── Bottom right: setup note ─── */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '60px',
            fontSize: '16px',
            color: '#64748b',
            fontWeight: '500',
            display: 'flex',
            zIndex: 3,
          }}
        >
          Installed in 48 hours
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}