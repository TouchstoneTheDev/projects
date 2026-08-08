export interface LighthouseResult {
    score: number;
    url: string;
    report: string;
}
export declare const runLighthouseAudit: (url: string) => Promise<LighthouseResult>;
//# sourceMappingURL=lighthouse.d.ts.map