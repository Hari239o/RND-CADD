import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || '';
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'educadd-cad-assets';
const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-educadd-cad-assets.r2.dev';

export function getR2Client(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array | Blob | string,
  contentType: string = 'application/octet-stream'
) {
  try {
    const s3 = getR2Client();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body as any,
      ContentType: contentType,
    });
    await s3.send(command);
    return {
      success: true,
      key,
      url: `${publicUrl}/${key}`,
    };
  } catch (error) {
    console.error('[Cloudflare R2] Upload error:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function getPresignedR2UploadUrl(key: string, contentType: string = 'application/octet-stream') {
  try {
    const s3 = getR2Client();
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return {
      success: true,
      uploadUrl,
      publicUrl: `${publicUrl}/${key}`,
    };
  } catch (error) {
    console.error('[Cloudflare R2] Presigned URL error:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function listR2Assets(prefix: string = '') {
  try {
    const s3 = getR2Client();
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      MaxKeys: 50,
    });
    const response = await s3.send(command);
    return {
      success: true,
      files: (response.Contents || []).map((file) => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
        url: `${publicUrl}/${file.Key}`,
      })),
    };
  } catch (error) {
    console.warn('[Cloudflare R2] List assets notice (credentials unconfigured or offline):', error);
    return {
      success: false,
      files: [],
      error: (error as Error).message,
    };
  }
}
