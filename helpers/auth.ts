import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { RequestInit } from "next/dist/compiled/@edge-runtime/primitives";

export const getAuthCookieName = () =>
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

export const getAuthHeader = (
  nextCookies: ReadonlyRequestCookies
): RequestInit => {
  const cookieName = getAuthCookieName();

  const nextAuthSessionToken = nextCookies.get(cookieName);

  if (!nextAuthSessionToken) return {};

  return {
    headers: {
      Cookie: `${nextAuthSessionToken.name}=${nextAuthSessionToken.value}`,
    } satisfies HeadersInit,
  };
};
