export interface Certificate {
  id: string | null;
  sku?: string;
  s3Bucket?: string;
  s3Key?: string;
  fileName?: string;
  displayName?: string;
  validityPeriod?: number;
  type?: string | null;
  status?: any;
}
