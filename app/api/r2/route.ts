import { NextResponse } from 'next/server';
import { listR2Assets, getPresignedR2UploadUrl } from '@/lib/cloudflare-r2';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get('prefix') || '';

  const result = await listR2Assets(prefix);
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    const key = `course-materials/${Date.now()}-${filename}`;
    const result = await getPresignedR2UploadUrl(key, contentType || 'application/pdf');

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
