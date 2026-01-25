import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom right, #065f46, #0f172a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 120,
              height: 120,
              background: 'white',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 40,
            }}
          >
            <span style={{ fontSize: 80, fontWeight: 'bold', color: '#065f46' }}>ST</span>
          </div>
          <div style={{ fontSize: 80, fontWeight: 'bold' }}>Saad Traders</div>
        </div>
        <div style={{ fontSize: 40, marginTop: 24, opacity: 0.95, letterSpacing: 1 }}>
          FBR‑Compliant Digital Invoicing — Pakistan
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
