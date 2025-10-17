import { SQSEvent, SQSRecord, SQSBatchResponse } from "aws-lambda";
import { EmailMessage } from "../../types/email";
import { emailService } from "../../service/emailService";
import { logger } from "../../config/logger";

export async function handler(event: SQSEvent): Promise<SQSBatchResponse> {
  logger.info("Processing email queue", { recordCount: event.Records.length });

  const batchItemFailures: { itemIdentifier: string }[] = [];

  // Process each record individually
  // Promise.allSettled --> process all messages, even if some fail
  await Promise.allSettled(
    event.Records.map(async (record: SQSRecord) => {
      try {
        const message: EmailMessage = JSON.parse(record.body);

        await emailService.sendEmail(message);

        logger.info("Email sent successfully", {
          messageId: record.messageId,
          type: message.type,
          to: message.to,
        });
      } catch (error) {
        logger.error("Failed to process SQS message", {
          messageId: record.messageId,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        // *  Add to failed items - SQS will retry only this message
        batchItemFailures.push({
          itemIdentifier: record.messageId,
        });
      }
    })
  );

  logger.info("Batch processing completed", {
    totalRecords: event.Records.length,
    failedRecords: batchItemFailures.length,
    successfulRecords: event.Records.length - batchItemFailures.length,
  });

  // Return the list of failed messages for SQS to retry
  return { batchItemFailures };
}
