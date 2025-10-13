export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseError";
  }
}
export class S3Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = "S3Error";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class TokenExchangeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenExchangeError";
  }
}

export class TokenRefreshError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenRefreshError";
  }
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

export class WebSocketError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WebSocketError";
  }
}

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
  }
}
