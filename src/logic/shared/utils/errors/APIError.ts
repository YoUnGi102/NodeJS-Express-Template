export interface ErrorMessage {
  status: number;
  message: string;
  title: string;
}

export class APIError extends Error {
  public status: number;
  public title?: string;

  constructor(
    status: number = 500,
    message: string = 'Internal Server Error',
    title: string = 'INTERNAL_SERVER_ERROR',
  ) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.title = title;

    Object.setPrototypeOf(this, APIError.prototype);
  }
}
