export class AppError extends Error {
    constructor(module, message, context = {}) {
        super(message);
        this.module = module;
        this.context = context;
        this.timestamp = new Date().toISOString();
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
export class ValidationError extends AppError {
    constructor(module, message, context = {}) {
        super(module, message, context);
    }
}
export class WorkflowError extends AppError {
    constructor(module, message, context = {}) {
        super(module, message, context);
    }
}
//# sourceMappingURL=index.js.map