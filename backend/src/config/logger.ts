import { Logger } from "@aws-lambda-powertools/logger";

export const logger = new Logger({
  serviceName: "novel-nest-book-service",
});
