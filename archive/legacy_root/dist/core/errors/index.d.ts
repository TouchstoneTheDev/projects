export declare class AppError extends Error {
    readonly module: string;
    readonly context: Record<string, unknown>;
    readonly timestamp: string;
    constructor(module: string, message: string, context?: Record<string, unknown>);
}
export declare class ValidationError extends AppError {
    constructor(module: string, message: string, context?: Record<string, unknown>);
}
export declare class WorkflowError extends AppError {
    constructor(module: string, message: string, context?: Record<string, unknown>);
}
//# sourceMappingURL=index.d.ts.map