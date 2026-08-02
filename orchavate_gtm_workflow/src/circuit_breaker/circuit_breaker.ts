import { ResolutionResult } from '../resolvers/resolver_types.js';

export interface CircuitBreakerStats {
  totalProcessed: number;
  failureCount: number;
  failureRatePercent: number;
}

export class CircuitBreaker {
  private totalProcessed = 0;
  private failureCount = 0;
  private thresholdRate: number; // e.g. 0.30
  private minProcessed: number;   // e.g. 5

  constructor(thresholdRate = 0.30, minProcessed = 5) {
    this.thresholdRate = thresholdRate;
    this.minProcessed = minProcessed;
  }

  public recordResult(result: ResolutionResult): boolean {
    this.totalProcessed++;
    if (result.confidence === 'LOW' || result.confidence === 'FAILED' || result.hasConflict || !result.resolvedUrl) {
      this.failureCount++;
    }

    if (this.totalProcessed >= this.minProcessed) {
      const rate = this.failureCount / this.totalProcessed;
      if (rate > this.thresholdRate) {
        return true; // Trigger circuit breaker
      }
    }
    return false;
  }

  public resetCount(): void {
    this.totalProcessed = 0;
    this.failureCount = 0;
  }

  public getStats(): CircuitBreakerStats {
    const rate = this.totalProcessed > 0 ? (this.failureCount / this.totalProcessed) * 100 : 0;
    return {
      totalProcessed: this.totalProcessed,
      failureCount: this.failureCount,
      failureRatePercent: Math.round(rate),
    };
  }
}
