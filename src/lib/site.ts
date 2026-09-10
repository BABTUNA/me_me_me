// Vercel supplies the production hostname automatically. Other hosts can set
// NEXT_PUBLIC_SITE_URL to their canonical origin, including the protocol.
const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = configuredUrl
  ? new URL(configuredUrl).origin
  : productionHost
    ? new URL(`https://${productionHost}`).origin
    : undefined;
