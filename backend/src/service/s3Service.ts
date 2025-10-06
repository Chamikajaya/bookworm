import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getS3Client } from "../config/s3";
import { logger } from "../config/logger";

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private urlExpTime: number;
  private cloudFrontDomain: string | undefined;

  constructor() {
    this.s3Client = getS3Client();
    this.bucketName = process.env.BOOK_COVERS_BUCKET!;
    this.urlExpTime = 3600; // 1 hour of presigned url exp time
    this.cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN;
  }

  async generatePresignedUrlForUpload(
    bookId: string,
    fileExtension: string,
    contentType: string
  ): Promise<{ uploadUrl: string; key: string }> {
    const timestamp = Date.now();
    const key = `book-covers/${bookId}/${timestamp}${fileExtension}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      Metadata: {
        bookId,
        uploadedAt: new Date().toISOString(),
      },
    });
    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.urlExpTime,
    });
    return { uploadUrl, key };
  }

  async generateCloudfrontUrlForView(key: string): Promise<string> {
    return `https://${this.cloudFrontDomain}/${key}`;
  }

  async deleteImage(key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      await this.s3Client.send(command);

      return true;
    } catch (error) {
      logger.info("Error deleting image from S3:", error as Error);
      return false;
    }
  }
}

export const s3Service = new S3Service();
