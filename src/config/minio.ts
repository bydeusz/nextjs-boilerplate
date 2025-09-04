import { Client } from 'minio';

// Parse MINIO_ACTIVE environment variable correctly
export const MINIO_ACTIVE = process.env.MINIO_ACTIVE === 'true' || process.env.MINIO_ACTIVE === '1';

export const minioClient = MINIO_ACTIVE
  ? new Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
    })
  : null;

export const MINIO_BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'uploads';

// Initialize bucket if it doesn't exist
export async function initializeBucket() {
  if (!MINIO_ACTIVE || !minioClient) {
    console.log('MinIO is not active, skipping bucket initialization');
    return;
  }
  
  try {
    const exists = await minioClient.bucketExists(MINIO_BUCKET_NAME);
    if (!exists) {
      await minioClient.makeBucket(MINIO_BUCKET_NAME);
      // Set bucket policy to public read if needed
      await minioClient.setBucketPolicy(MINIO_BUCKET_NAME, JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${MINIO_BUCKET_NAME}/*`]
          }
        ]
      }));
    }
  } catch (error) {
    console.error('Error initializing MinIO bucket:', error);
  }
}
