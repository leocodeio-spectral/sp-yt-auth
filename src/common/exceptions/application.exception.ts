export class ApplicationException extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'ApplicationException';
  }
}
