/**
 * Production CSP. Nonce + strict-dynamic replaces 'unsafe-inline' / 'unsafe-eval'
 * for scripts. Development still needs 'unsafe-eval' for React dev stacks.
 */
export function buildContentSecurityPolicy(nonce: string, isDev: boolean): string {
  const scriptSrc = [
    "script-src 'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    "https://apis.google.com",
    isDev ? "'unsafe-eval'" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const policy = [
    "default-src 'self'",
    scriptSrc,
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://api.openai.com https://api.anthropic.com https://api.mistral.ai https://api.fireworks.ai",
    "frame-src 'self' https://accounts.google.com https://*.google.com https://*.firebaseapp.com https://apis.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    isDev ? null : "upgrade-insecure-requests",
  ]
    .filter(Boolean)
    .join("; ");

  return policy;
}
