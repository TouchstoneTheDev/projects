export class AppError extends Error {
  public readonly module: string;
  public readonly context: Record<string, unknown>;
  public readonly timestamp: string;

  constructor(module: string, message: string, context: Record<string, unknown> = {}) {
    super(message);
    this.module = module;
    this.context = context;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(module: string, message: string, context: Record<string, unknown> = {}) {
    super(module, message, context);
  }
}

export class WorkflowError extends AppError {
  constructor(module: string, message: string, context: Record<string, unknown> = {}) {
    super(module, message, context);
  }
}
