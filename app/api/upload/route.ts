import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate reliable Data URL fallback for serverless environments (Vercel)
    const mimeType = file.type || 'image/png';
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    let fileUrl = dataUrl;

    // Try saving to public/uploads if filesystem is writable (local/standalone servers)
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${Date.now()}-${safeName}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      fileUrl = `/uploads/${filename}`;
    } catch (fsErr) {
      // In serverless / Vercel read-only environments, use base64 dataUrl seamlessly
      fileUrl = dataUrl;
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      name: file.name,
      size: file.size,
    });
  } catch (error: any) {
    console.error('[Upload API] Error saving file:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
