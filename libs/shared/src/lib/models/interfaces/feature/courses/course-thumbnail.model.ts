export interface S3BucketData {
  key: string;
  bucket: string;
}

export interface GenerateThumbnailPayload {
  id: string;
}

export interface UploadThumbnailPayload {
  id: string;
  thumbnailKey: string;
  thumbnailBucket: string;
}
