import { z } from 'zod';
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        production: "production";
        test: "test";
    }>>;
    LOG_LEVEL: z.ZodDefault<z.ZodString>;
    OUTPUT_DIR: z.ZodDefault<z.ZodString>;
    TRACKER_FILE: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
type EnvConfig = z.infer<typeof envSchema>;
export declare const config: EnvConfig;
export {};
//# sourceMappingURL=index.d.ts.map