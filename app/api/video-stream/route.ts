import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function extractGoogleDriveFileId(input?: string | null): string {
  if (!input) return '1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c';
  const trimmed = input.trim();
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) return fileMatch[1];

  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];

  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) return trimmed;

  return '1-tNZoMwAYd1jXLuVka8Lhkgqaxlj1V0c';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id') || searchParams.get('fileId') || searchParams.get('url');
    const fileId = extractGoogleDriveFileId(idParam);

    const driveUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
    const rangeHeader = request.headers.get('range');

    const fetchHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };
    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader;
    }

    const driveRes = await fetch(driveUrl, {
      headers: fetchHeaders,
      redirect: 'follow',
    });

    if (!driveRes.ok && driveRes.status !== 206) {
      console.error(`[VideoStream] Google Drive returned ${driveRes.status}`);
      return new NextResponse('Failed to stream video from source', { status: driveRes.status });
    }

    const outgoingHeaders = new Headers();
    const contentDisposition = driveRes.headers.get('content-disposition') || '';
    
    // Determine mime type
    let contentType = 'video/webm';
    if (contentDisposition.toLowerCase().includes('.mp4')) {
      contentType = 'video/mp4';
    } else if (contentDisposition.toLowerCase().includes('.webm')) {
      contentType = 'video/webm';
    } else if (contentDisposition.toLowerCase().includes('.mkv')) {
      contentType = 'video/x-matroska';
    }

    outgoingHeaders.set('Content-Type', contentType);
    outgoingHeaders.set('Content-Disposition', 'inline');
    outgoingHeaders.set('Accept-Ranges', 'bytes');
    outgoingHeaders.set('Access-Control-Allow-Origin', '*');
    outgoingHeaders.set('Access-Control-Expose-Headers', 'X-Video-Duration, Content-Range, Content-Length');
    outgoingHeaders.set('X-Video-Duration', '868');
    outgoingHeaders.set('Access-Control-Expose-Headers', 'X-Video-Duration, Content-Range, Content-Length');
    outgoingHeaders.set('X-Video-Duration', '868');
    outgoingHeaders.set('Cache-Control', 'public, max-age=3600');

    const contentRange = driveRes.headers.get('content-range');
    if (contentRange) {
      outgoingHeaders.set('Content-Range', contentRange);
    }
    const contentLength = driveRes.headers.get('content-length');
    if (contentLength) {
      outgoingHeaders.set('Content-Length', contentLength);
    }

    return new NextResponse(driveRes.body, {
      status: driveRes.status,
      headers: outgoingHeaders,
    });
  } catch (error: any) {
    console.error('[VideoStream] Error streaming media:', error);
    return new NextResponse('Internal server error streaming video', { status: 500 });
  }
}

export async function HEAD(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id') || searchParams.get('fileId') || searchParams.get('url');
    const fileId = extractGoogleDriveFileId(idParam);

    const driveUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download`;
    const driveRes = await fetch(driveUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      redirect: 'follow',
    });

    const outgoingHeaders = new Headers();
    outgoingHeaders.set('Content-Type', 'video/webm');
    outgoingHeaders.set('Accept-Ranges', 'bytes');
    outgoingHeaders.set('Access-Control-Allow-Origin', '*');
    outgoingHeaders.set('Access-Control-Expose-Headers', 'X-Video-Duration, Content-Range, Content-Length');
    outgoingHeaders.set('X-Video-Duration', '868');
    const contentLength = driveRes.headers.get('content-length');
    if (contentLength) {
      outgoingHeaders.set('Content-Length', contentLength);
    }

    return new NextResponse(null, {
      status: driveRes.status,
      headers: outgoingHeaders,
    });
  } catch (error: any) {
    return new NextResponse(null, { status: 500 });
  }
}
