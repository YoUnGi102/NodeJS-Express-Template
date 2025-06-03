import request from 'supertest';

/**
 * Extracts a cookie value from the Set-Cookie header in a Supertest response.
 *
 * @param res - The Supertest response object
 * @param cookieName - The name of the cookie to extract
 * @returns The cookie value, or undefined if not found
 */
export function extractCookie(
  res: request.Response,
  cookieName: string,
): string {
  const rawCookies = res.headers['set-cookie'];

  if (!rawCookies) {
    throw new Error('Refresh Token Cookie not found');
  }

  const extractValue = (cookie: string) => {
    if (cookie.startsWith(`${cookieName}=`)) {
      return cookie.split(';')[0].split('=')[1];
    }
    throw new Error('Refresh Token Cookie not found');
  };

  if (Array.isArray(rawCookies)) {
    for (const cookie of rawCookies) {
      const value = extractValue(cookie);
      if (value) return value;
    }
  } else if (typeof rawCookies === 'string') {
    return extractValue(rawCookies);
  }

  throw new Error('Refresh Token Cookie not found');
}

/**
 * Checks if the response includes a "jid" refresh token cookie.
 * @param res - The Supertest response object.
 * @returns `true` if a "jid" cookie is found, otherwise `false`.
 */
export const hasRefreshCookie = (res: request.Response): boolean => {
  const setCookieHeader = res.headers['set-cookie'];

  if (!setCookieHeader || !Array.isArray(setCookieHeader)) {
    return false;
  }

  return setCookieHeader.some((cookie: string) =>
    cookie.trim().startsWith('jid='),
  );
};
