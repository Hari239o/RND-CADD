import { NextResponse } from 'next/server';
import { testMongoConnection, getMongoDbName, getMongoUri } from '@/lib/mongodb';
import {
  isCloudflareR2Configured,
  isCloudflareImagesConfigured,
  getR2Config,
} from '@/lib/cloudflare-r2';

export const dynamic = 'force-dynamic';

function maskString(val: string): string {
  if (!val || val.length <= 4) return val ? '****' : '';
  return `****${val.slice(-4)}`;
}

export async function GET() {
  const mongoTest = await testMongoConnection();
  const rawUri = getMongoUri();
  const dbName = getMongoDbName();

  const r2Config = getR2Config();
  const r2Configured = isCloudflareR2Configured();
  const imagesConfigured = isCloudflareImagesConfigured();

  // Mask MongoDB URI for safe diagnostic display
  let maskedMongoUri = rawUri;
  if (rawUri.includes('@')) {
    const parts = rawUri.split('@');
    maskedMongoUri = `mongodb+srv://****:****@${parts[1]}`;
  }

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    database: {
      provider: 'MongoDB',
      connected: mongoTest.connected,
      status: mongoTest.connected ? 'Operational' : 'Disconnected',
    },
    cloudStorage: {
      provider: 'Cloudflare',
      configured: r2Configured || imagesConfigured,
      activeProvider: r2Configured
        ? 'Cloudflare R2 Object Storage'
        : imagesConfigured
        ? 'Cloudflare Images'
        : 'Standby / Local Fallback',
    },
  });
}
