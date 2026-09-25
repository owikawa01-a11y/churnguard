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
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#05050c',
          padding: '80px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Gradient orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            right: '-200px',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-200px',
            left: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(217,70,239,0.3) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="36"
              height="36"
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
              fontSize: '38px',
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
            fontSize: '76px',
            fontWeight: 'bold',
            color: '#ffffff',
            lineHeight: '1.05',
            letterSpacing: '-0.03em',
            marginBottom: '24px',
            display: 'flex',
          }}
        >
          Stop losing customers
        </div>
        <div
          style={{
            fontSize: '76px',
            fontWeight: 'bold',
            color: '#a78bfa',
            lineHeight: '1.05',
            letterSpacing: '-0.03em',
            marginBottom: '40px',
            display: 'flex',
          }}
        >
          silently.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '32px',
            color: '#94a3b8',
            lineHeight: '1.4',
            maxWidth: '900px',
            display: 'flex',
          }}
        >
          I install RetainPulse on your site in 48 hours — then manage it for 30 days.
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 24px',
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: '100px',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#a78bfa',
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: '20px',
              color: '#c4b5fd',
              fontWeight: '600',
              letterSpacing: '0.05em',
              display: 'flex',
            }}
          >
            FOUNDING MEMBERS · 5 SPOTS
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '80px',
            fontSize: '24px',
            color: '#64748b',
            fontWeight: '600',
            display: 'flex',
          }}
        >
          retainpulse.pro
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}