import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import {
  isCloudflareConfigured,
  uploadCourseAssetToCloudflare,
} from '@/lib/cloudflare-r2';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string | null) || 'courses';

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/png';
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

    // 1. PRIMARY: Try Cloudflare (R2 or Images API) if configured
    if (isCloudflareConfigured()) {
      try {
        const cloudflareResult = await uploadCourseAssetToCloudflare(
          buffer,
          file.name,
          mimeType,
          folder
        );

        if (cloudflareResult.success && cloudflareResult.url) {
          return NextResponse.json({
            success: true,
            url: cloudflareResult.url,
            provider: cloudflareResult.provider || 'cloudflare',
            key: cloudflareResult.key,
            name: file.name,
            size: file.size,
          });
        }
      } catch (cfErr) {
        console.warn('[Upload API] Cloudflare upload attempt encountered an issue, falling back:', cfErr);
      }
    }

    // 2. FALLBACK: Generate Base64 Data URL for serverless resilience
    const base64Data = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    let fileUrl = dataUrl;
    let provider = 'base64';

    // 3. Optional local disk save if filesystem is writable
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      const filename = `${Date.now()}-${safeName}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);
      fileUrl = `/uploads/${filename}`;
      provider = 'local-disk';
    } catch {
      // In serverless / read-only environments, keep fileUrl as dataUrl
      fileUrl = dataUrl;
      provider = 'base64';
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      provider,
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
