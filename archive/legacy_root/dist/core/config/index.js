import { z } from 'zod';
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    LOG_LEVEL: z.string().default('info'),
    OUTPUT_DIR: z.string().default('output'),
    TRACKER_FILE: z.string().default('master-tracker.csv'),
});
export const config = envSchema.parse(process.env);
//# sourceMappingURL=index.js.map