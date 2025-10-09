import { defineMiddleware } from 'astro/middleware';
import { generateNonce, getSecurityHeaders, type CSPConfig } from '@/utils/security/csp';

export const onRequest = defineMiddleware(async (context, next) => {
  const nonce = generateNonce();
  context.locals.nonce = nonce;

  const response = await next();

  const baseCspOptions: CSPConfig = {
    scriptNonce: nonce,
    styleNonce: nonce,
    reportOnly: import.meta.env.DEV,
    upgradeInsecureRequests: !import.meta.env.DEV,
  };

  if (!import.meta.env.DEV) {
    baseCspOptions.reportUri = '/api/csp-report';
  }

  const headers = getSecurityHeaders(context.url.hostname, baseCspOptions);

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
});
