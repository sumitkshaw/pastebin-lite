/**
 * Utility for handling time, especially for TEST_MODE
 */
export class TimeUtils {
  /**
   * Check if TEST_MODE is enabled
   */
  static isTestMode(): boolean {
    return process.env.TEST_MODE === '1';
  }

  /**
   * Get current time, respecting TEST_MODE and x-test-now-ms header
   */
  static getCurrentTime(request: Request | null = null): Date {
    // Check if TEST_MODE is enabled
    if (this.isTestMode() && request) {
      const testTimeHeader = request.headers.get('x-test-now-ms');
      if (testTimeHeader) {
        const testTimeMs = parseInt(testTimeHeader, 10);
        if (!isNaN(testTimeMs)) {
          return new Date(testTimeMs);
        }
      }
    }
    
    // Return real system time
    return new Date();
  }

  /**
   * Check if a paste is expired at a given time
   */
  static isPasteExpired(expiresAt: Date | null, checkTime: Date): boolean {
    if (!expiresAt) return false;
    return expiresAt <= checkTime;
  }

  /**
   * Calculate time remaining until expiration (in seconds)
   */
  static getTimeRemaining(expiresAt: Date | null, fromTime: Date = new Date()): number | null {
    if (!expiresAt) return null;
    const diffMs = expiresAt.getTime() - fromTime.getTime();
    return Math.max(0, Math.floor(diffMs / 1000));
  }

  /**
   * Parse test time header from request
   */
  static parseTestTimeHeader(request: Request): number | null {
    const header = request.headers.get('x-test-now-ms');
    if (!header) return null;
    
    const timeMs = parseInt(header, 10);
    return isNaN(timeMs) ? null : timeMs;
  }
}