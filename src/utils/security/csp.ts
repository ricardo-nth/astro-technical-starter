/**
 * Enhanced Content Security Policy Configuration
 * Provides comprehensive security headers for production deployment
 */

export interface CSPConfig {
  reportOnly?: boolean;
  reportUri?: string;
  upgradeInsecureRequests?: boolean;
}

export function generateCSP(config: CSPConfig = {}) {
  const {
    reportOnly = false,
    reportUri,
    upgradeInsecureRequests = true
  } = config;

  // Base CSP directives for Astro Technical SEO Starter
  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for Astro hydration
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://js.sentry-cdn.com',
      'https://www.clarity.ms'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for critical CSS
      'https://fonts.googleapis.com'
    ],
    'img-src': [
      "'self'",
      'data:', // For base64 images
      'https:', // Allow HTTPS images
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:' // For embedded fonts
    ],
    'connect-src': [
      "'self'",
      'https://www.google-analytics.com',
      'https://region1.google-analytics.com',
      'https://www.googletagmanager.com',
      'https://*.ingest.sentry.io',
      'https://www.clarity.ms',
      'https://c.clarity.ms'
    ],
    'frame-src': [
      "'none'" // Prevent framing attacks
    ],
    'object-src': [
      "'none'" // Prevent object/embed attacks
    ],
    'base-uri': [
      "'self'" // Prevent base tag injection
    ],
    'form-action': [
      "'self'" // Restrict form submissions
    ]
  };

  // Add report URI if provided
  if (reportUri) {
    directives['report-uri'] = [reportUri];
  }

  // Convert directives to CSP string
  const cspString = Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');

  // Add upgrade-insecure-requests if enabled
  const finalCSP = upgradeInsecureRequests 
    ? `${cspString}; upgrade-insecure-requests`
    : cspString;

  return {
    headerName: reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy',
    headerValue: finalCSP
  };
}

export function getSecurityHeaders(config: CSPConfig = {}) {
  const csp = generateCSP(config);
  
  return {
    // Content Security Policy
    [csp.headerName]: csp.headerValue,
    
    // HTTP Strict Transport Security
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // X-Frame-Options (defense in depth with CSP)
    'X-Frame-Options': 'DENY',
    
    // X-Content-Type-Options
    'X-Content-Type-Options': 'nosniff',
    
    // X-XSS-Protection (legacy browsers)
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy (Feature Policy)
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()' // Disable FLoC
    ].join(', '),
    
    // Cross-Origin Embedder Policy
    'Cross-Origin-Embedder-Policy': 'credentialless',
    
    // Cross-Origin Opener Policy
    'Cross-Origin-Opener-Policy': 'same-origin',
    
    // Cross-Origin Resource Policy
    'Cross-Origin-Resource-Policy': 'same-site'
  };
}

// Middleware for Astro
export function securityMiddleware(_domain?: string) {
  return async function(_: Request, next: () => Response | Promise<Response>) {
    const response = await next();
    const headers = getSecurityHeaders();
    
    // Apply security headers to response
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  };
}

// Development vs Production configuration
export function getEnvironmentCSP() {
  const isDev = import.meta.env.DEV;
  
  if (isDev) {
    // More permissive CSP for development
    return generateCSP({
      reportOnly: true, // Don't block in development
      upgradeInsecureRequests: false
    });
  }
  
  // Strict CSP for production
  return generateCSP({
    reportOnly: false,
    reportUri: '/api/csp-report', // Optional CSP violation reporting
    upgradeInsecureRequests: true
  });
}
