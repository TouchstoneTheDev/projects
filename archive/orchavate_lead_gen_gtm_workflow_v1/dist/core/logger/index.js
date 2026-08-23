import pino from 'pino';
const logger = pino({
    name: 'digital-accessibility-outreach-platform',
    level: process.env.LOG_LEVEL ?? 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    base: {
        service: 'accessibility-outreach',
    },
});
export const log = logger;
export const childLogger = (bindings) => logger.child(bindings);
//# sourceMappingURL=index.js.map