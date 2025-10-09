/**
 * Sentry configuration for error monitoring
 * Provides production error tracking and performance monitoring
 */

import { ENV, isProduction, isDevelopment } from '../env.js';
import { init, captureException, withScope, browserTracingIntegration } from '@sentry/browser';
import type { ErrorEvent, EventHint } from '@sentry/browser';

export interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
  integrations?: unknown[];
  beforeSend?: (event: ErrorEvent, hint: EventHint) => ErrorEvent | null;
}

export function getSentryConfig(): SentryConfig | null {
  if (!ENV.SENTRY_DSN) {
    return null;
  }

  return {
    dsn: ENV.SENTRY_DSN,
    environment: ENV.NODE_ENV,
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    beforeSend(event: ErrorEvent) {
      // Filter out development errors
      if (isDevelopment) {
        return null;
      }
      
      // Filter out known non-critical errors
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === 'ChunkLoadError' || error?.type === 'TypeError') {
          return null;
        }
      }
      
      return event;
    },
  };
}

export function initSentry() {
  const config = getSentryConfig();
  if (!config) {
    // Sentry not configured - monitoring disabled (this is normal for development)
    return;
  }

  // Initialize Sentry in production
  if (isProduction) {
    init({
      ...config,
      integrations: [browserTracingIntegration()],
    });
    console.log('Sentry error monitoring initialized');
  }
}

export function captureError(error: Error, context?: Record<string, any>) {
  if (isProduction && ENV.SENTRY_DSN) {
    withScope((scope) => {
      if (context) {
        Object.keys(context).forEach(key => {
          scope.setTag(key, context[key]);
        });
      }
      captureException(error);
    });
  } else {
    console.error('Error captured:', error, context);
  }
}
