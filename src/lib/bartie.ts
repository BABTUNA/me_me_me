// Base URL of the running Bartie control api (see Bartie/deploy). Vercel sets
// NEXT_PUBLIC_BARTIE_API_URL to the Caddy-fronted domain; locally the compose
// "live" profile serves it on 8088.
export const bartieApiUrl = (
  process.env.NEXT_PUBLIC_BARTIE_API_URL ?? "http://localhost:8088"
).replace(/\/$/, "");

export const bartieRepoUrl = "https://github.com/BABTUNA/Bartie";
