import { serialize, parse, SerializeOptions } from "cookie";

const COOKIE_OPTIONS: SerializeOptions = {
  httpOnly: true, // to prevent cookie from being accessed by JavaScript
  secure: true, // browser will only send the cookie over HTTPS
  sameSite: "none", // Allow cross-site cookie sending
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

export const createCookie = (
  name: string,
  value: string,
  options?: SerializeOptions
): string => {
  return serialize(name, value, { ...COOKIE_OPTIONS, ...options });
};

export const parseCookies = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {};
  const parsed = parse(cookieHeader);
  // Filter out undefined values
  return Object.fromEntries(
    Object.entries(parsed).filter(([_, value]) => value !== undefined)
  ) as Record<string, string>;
};

export const clearCookie = (name: string): string => {
  return serialize(name, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
};

export const COOKIE_NAMES = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  ID_TOKEN: "id_token",
} as const;
