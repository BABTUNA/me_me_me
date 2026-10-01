// Base URL of the running Super Bartie control api (see SuperBartie/deploy).
// Vercel sets NEXT_PUBLIC_SUPER_BARTIE_API_URL to the Caddy-fronted domain;
// locally the compose "live" profile serves it on 8088.
export const superBartieApiUrl = (
  process.env.NEXT_PUBLIC_SUPER_BARTIE_API_URL ?? "http://localhost:8088"
).replace(/\/$/, "");

export const superBartieRepoUrl = "https://github.com/BABTUNA/SuperBartie";
