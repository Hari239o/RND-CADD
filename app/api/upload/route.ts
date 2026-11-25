import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/mongodb';
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
    const base64Data = buffer.toString('base64');

    // 1. PRIMARY (When configured): Cloudflare R2 / Images
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
        console.warn('[Upload API] Cloudflare upload error, falling back to MongoDB:', cfErr);
      }
    }

    // 2. MONGODB DIRECT MEDIA STORAGE: Stores directly in MongoDB cluster
    try {
      const { db, isConnected } = await connectToDatabase();
      if (isConnected && db) {
        const mediaDoc = {
          filename: safeName,
          contentType: mimeType,
          data: base64Data,
          size: file.size,
          folder,
          createdAt: new Date(),
        };

        const result = await db.collection('media').insertOne(mediaDoc);
        const fileUrl = `/api/media/${result.insertedId}`;

        return NextResponse.json({
          success: true,
          url: fileUrl,
          provider: 'mongodb',
          id: result.insertedId.toString(),
          name: file.name,
          size: file.size,
        });
      }
    } catch (dbErr) {
      console.warn('[Upload API] MongoDB media storage error, using serverless fallback:', dbErr);
    }

    // 3. FALLBACK: Data URL (Guaranteed 100% persistent across serverless instances)
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    let fileUrl = dataUrl;
    let provider = 'base64';

    // Only use local disk in local development; on serverless production, dataUrl is 100% permanent
    if (process.env.NODE_ENV === 'development') {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        const filename = `${Date.now()}-${safeName}`;
        const filePath = path.join(uploadDir, filename);
        await fs.writeFile(filePath, buffer);
        fileUrl = `/uploads/${filename}`;
        provider = 'local-disk';
      } catch {
        fileUrl = dataUrl;
        provider = 'base64';
      }
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
