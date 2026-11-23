import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export function getR2Config() {
  const accountId = (process.env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim();
  const accessKeyId = (process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = (process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '').trim();
  const bucketName = (process.env.CLOUDFLARE_R2_BUCKET_NAME || 'rndcadd-assets').trim();
  let publicUrl = (process.env.CLOUDFLARE_R2_PUBLIC_URL || '').trim();

  // Strip trailing slashes from publicUrl if provided
  if (publicUrl) {
    publicUrl = publicUrl.replace(/\/+$/, '');
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl,
  };
}

export function isCloudflareR2Configured(): boolean {
  const { accountId, accessKeyId, secretAccessKey, bucketName } = getR2Config();
  if (!accountId || accountId.startsWith('sample_') || accountId.startsWith('your_')) return false;
  if (!accessKeyId || accessKeyId.startsWith('sample_') || accessKeyId.startsWith('your_')) return false;
  if (!secretAccessKey || secretAccessKey.startsWith('sample_') || secretAccessKey.startsWith('your_')) return false;
  if (!bucketName || bucketName.startsWith('sample_')) return false;
  return true;
}

export function isCloudflareImagesConfigured(): boolean {
  const apiToken = (process.env.CLOUDFLARE_IMAGES_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN || '').trim();
  const accountId = (process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim();
  if (!apiToken || apiToken.startsWith('your_') || apiToken.startsWith('sample_')) return false;
  if (!accountId || accountId.startsWith('your_') || accountId.startsWith('sample_')) return false;
  return true;
}

export function isCloudflareConfigured(): boolean {
  return isCloudflareR2Configured() || isCloudflareImagesConfigured();
}

export function getR2Client(): S3Client {
  const { accountId, accessKeyId, secretAccessKey } = getR2Config();
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Uploads any asset (buffer, bytes, string) to Cloudflare R2
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array | Blob | string,
  contentType: string = 'application/octet-stream'
): Promise<{
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}> {
  if (!isCloudflareR2Configured()) {
    return {
      success: false,
      error: 'Cloudflare R2 credentials are not configured.',
    };
  }

  try {
    const { bucketName, publicUrl, accountId } = getR2Config();
    const s3 = getR2Client();

    // Clean up key: ensure no leading slash
    const cleanKey = key.replace(/^\/+/, '');

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
      Body: body as any,
      ContentType: contentType,
    });

    await s3.send(command);

    // Build the public asset URL
    let fileUrl = publicUrl ? `${publicUrl}/${cleanKey}` : `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${cleanKey}`;

    return {
      success: true,
      key: cleanKey,
      url: fileUrl,
    };
  } catch (error: any) {
    console.error('[Cloudflare R2] Upload error:', error);
    return {
      success: false,
      error: error?.message || 'Failed to upload to Cloudflare R2',
    };
  }
}

/**
 * Upload an image using the Cloudflare Images API
 */
export async function uploadToCloudflareImages(
  fileBuffer: Buffer,
  fileName: string
): Promise<{
  success: boolean;
  url?: string;
  id?: string;
  error?: string;
}> {
  if (!isCloudflareImagesConfigured()) {
    return {
      success: false,
      error: 'Cloudflare Images API credentials are not configured.',
    };
  }

  try {
    const apiToken = (process.env.CLOUDFLARE_IMAGES_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN || '').trim();
    const accountId = (process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_R2_ACCOUNT_ID || '').trim();

    const formData = new FormData();
    const blob = new Blob([fileBuffer]);
    formData.append('file', blob, fileName);

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (data.success && data.result) {
      const variants = data.result.variants || [];
      const publicUrl = variants[0] || `https://imagedelivery.net/${data.result.id}/public`;
      return {
        success: true,
        url: publicUrl,
        id: data.result.id,
      };
    }

    return {
      success: false,
      error: data.errors?.[0]?.message || 'Cloudflare Images upload failed',
    };
  } catch (error: any) {
    console.error('[Cloudflare Images] Upload error:', error);
    return {
      success: false,
      error: error?.message || 'Cloudflare Images API request failed',
    };
  }
}

/**
 * Unified course image / media uploader
 * Automatically routes to Cloudflare R2 (or Images API) with key pathing
 */
export async function uploadCourseAssetToCloudflare(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string = 'image/png',
  folder: string = 'courses'
): Promise<{
  success: boolean;
  url?: string;
  key?: string;
  provider?: 'cloudflare-r2' | 'cloudflare-images';
  error?: string;
}> {
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '') || 'courses';
  const objectKey = `${cleanFolder}/${timestamp}-${safeName}`;

  // 1. Try Cloudflare R2 first
  if (isCloudflareR2Configured()) {
    const r2Result = await uploadToR2(objectKey, fileBuffer, contentType);
    if (r2Result.success && r2Result.url) {
      return {
        success: true,
        url: r2Result.url,
        key: r2Result.key,
        provider: 'cloudflare-r2',
      };
    }
  }

  // 2. Try Cloudflare Images API if R2 is not configured or failed
  if (isCloudflareImagesConfigured() && contentType.startsWith('image/')) {
    const imagesResult = await uploadToCloudflareImages(fileBuffer, fileName);
    if (imagesResult.success && imagesResult.url) {
      return {
        success: true,
        url: imagesResult.url,
        key: imagesResult.id,
        provider: 'cloudflare-images',
      };
    }
  }

  return {
    success: false,
    error: 'No active Cloudflare storage credentials configured.',
  };
}

export async function getPresignedR2UploadUrl(key: string, contentType: string = 'application/octet-stream') {
  if (!isCloudflareR2Configured()) {
    return { success: false, error: 'Cloudflare R2 is not configured.' };
  }

  try {
    const { bucketName, publicUrl } = getR2Config();
    const s3 = getR2Client();
    const cleanKey = key.replace(/^\/+/, '');
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return {
      success: true,
      uploadUrl,
      publicUrl: publicUrl ? `${publicUrl}/${cleanKey}` : undefined,
    };
  } catch (error: any) {
    console.error('[Cloudflare R2] Presigned URL error:', error);
    return {
      success: false,
      error: error?.message || 'Failed to generate presigned URL',
    };
  }
}

export async function listR2Assets(prefix: string = '') {
  if (!isCloudflareR2Configured()) {
    return { success: false, files: [], error: 'Cloudflare R2 is not configured.' };
  }

  try {
    const { bucketName, publicUrl } = getR2Config();
    const s3 = getR2Client();
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      MaxKeys: 100,
    });
    const response = await s3.send(command);
    return {
      success: true,
      files: (response.Contents || []).map((file) => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
        url: publicUrl ? `${publicUrl}/${file.Key}` : undefined,
      })),
    };
  } catch (error: any) {
    console.warn('[Cloudflare R2] List assets notice:', error);
    return {
      success: false,
      files: [],
      error: error?.message || 'Failed to list R2 assets',
    };
  }
}
