// ! TODO: Need to verify the email address of the user upon registration, otherwise SES will not allow sending email to unverified addresses in the sandbox mode.

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { EmailMessage } from "../types/email";
import { logger } from "../config/logger";
import Handlebars from "handlebars";
import { getSESClient } from "../config/ses";
import { getS3Client } from "../config/s3";
import { EmailError, S3Error, ValidationError } from "../utils/errors";

// In-memory cache for compiled templates.
const templateCache = new Map<string, Handlebars.TemplateDelegate>();

class EmailService {
  private sesClient: SESClient;
  private s3Client: S3Client;
  private fromEmail: string;
  private templateBucket: string;

  constructor() {
    this.sesClient = getSESClient();
    this.s3Client = getS3Client();
    this.fromEmail = process.env.SES_FROM_EMAIL!;
    this.templateBucket = process.env.EMAIL_TEMPLATE_BUCKET!;
  }

  async sendEmail(message: EmailMessage): Promise<void> {
    try {
      // Get the appropriate compiled template
      const template = await this.getTemplate(message.type);

      // Generate the HTML by passing the data to the template
      const htmlBody = template({
        ...message.data,
        frontendUrl: process.env.FRONTEND_URL, // Inject global variables
      });

      // 3. Send the email using SES
      await this.sesClient.send(
        new SendEmailCommand({
          Source: this.fromEmail,
          Destination: { ToAddresses: [message.to] },
          Message: {
            Subject: { Data: message.subject },
            Body: { Html: { Data: htmlBody } },
          },
        })
      );

      logger.info("Email sent successfully", {
        to: message.to,
        type: message.type,
      });
    } catch (error) {
      logger.error("Failed to send email", error as Error);
      throw new EmailError(
        `Failed to send email: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // Fetches an email template from S3, compiles it, and caches it.
  private async getTemplate(
    templateName: string
  ): Promise<Handlebars.TemplateDelegate> {
    // Check the cache first
    if (templateCache.has(templateName)) {
      return templateCache.get(templateName)!;
    }

    //  If not cached, fetch from S3
    logger.info({
      message: "Template not in cache. Fetching from S3.",
      templateName,
    });

    const command = new GetObjectCommand({
      Bucket: this.templateBucket,
      Key: `${templateName}.hbs`,
    });

    try {
      const response = await this.s3Client.send(command);
      const templateBody = await response.Body?.transformToString("utf-8");

      if (!templateBody) {
        throw new ValidationError(`Template ${templateName} is empty.`);
      }

      //  Compile the template and store it in the cache
      const compiledTemplate = Handlebars.compile(templateBody);
      templateCache.set(templateName, compiledTemplate);

      return compiledTemplate;
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new S3Error(
        `Failed to fetch template from S3: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export const emailService = new EmailService();
