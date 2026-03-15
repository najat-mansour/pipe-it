export abstract class HttpError extends Error {
  public statusCode: number;
  constructor(msg: string) {
    super(msg);
    this.statusCode = 0;
  }
}

export class BadRequestError extends HttpError {
  constructor(msg: string) {
    super(msg);
    this.statusCode = 400;
  }
}

export class UnAuthorizedError extends HttpError {
  constructor(msg: string) {
    super(msg);
    this.statusCode = 401;
  }
}

export class ForbiddenError extends HttpError {
  constructor(msg: string) {
    super(msg);
    this.statusCode = 403;
  }
}

export class NotFoundError extends HttpError {
  constructor(msg: string) {
    super(msg);
    this.statusCode = 404;
  }
}
