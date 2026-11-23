import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return new NextResponse('Media ID is required', { status: 400 });
    }

    const { db, isConnected } = await connectToDatabase();
    if (!isConnected || !db) {
      return new NextResponse('Database connection unavailable', { status: 503 });
    }

    // Try finding by ObjectId or by string id
    let query: any = { _id: id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { id }] };
    }

    const media = await db.collection('media').findOne(query);

    if (!media || !media.data) {
      return new NextResponse('Media asset not found', { status: 404 });
    }

    const buffer = Buffer.from(media.data, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': media.contentType || 'image/png',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('[Media API] Error serving media:', error);
    return new NextResponse('Failed to retrieve media asset', { status: 500 });
  }
}
