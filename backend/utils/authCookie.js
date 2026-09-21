const crypto = require("crypto");

const SESSION_COOKIE_NAME = "book_tracker_session";
const CSRF_COOKIE_NAME = "book_tracker_csrf";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function getCookieSettings() {
  const configuredSameSite = (
    process.env.COOKIE_SAME_SITE || "lax"
  ).toLowerCase();

  const sameSite = ["lax", "strict", "none"].includes(
    configuredSameSite
  )
    ? configuredSameSite
    : "lax";

  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.COOKIE_SECURE === "true" ||
    sameSite === "none";

  return {
    sameSite:
      sameSite.charAt(0).toUpperCase() +
      sameSite.slice(1),
    secure,
  };
}

function appendSetCookie(res, cookie) {
  const existing = res.getHeader("Set-Cookie");

  if (!existing) {
    res.setHeader("Set-Cookie", [cookie]);
    return;
  }

  const cookies = Array.isArray(existing)
    ? existing
    : [existing];

  res.setHeader("Set-Cookie", [...cookies, cookie]);
}

function serializeCookie(name, value, options = {}) {
  const settings = getCookieSettings();
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `SameSite=${settings.sameSite}`,
  ];

  if (typeof options.maxAge === "number") {
    parts.push(`Max-Age=${options.maxAge}`);
  }

  if (options.expires) {
    parts.push(`Expires=${options.expires.toUTCString()}`);
  }

  if (options.httpOnly) {
    parts.push("HttpOnly");
  }

  if (settings.secure) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

function setAuthCookies(res, token, rememberMe = true) {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  const sessionOptions = {
    httpOnly: true,
  };

  if (rememberMe) {
    sessionOptions.maxAge = SESSION_MAX_AGE_SECONDS;
  }

  const csrfOptions = {};

  if (rememberMe) {
    csrfOptions.maxAge = SESSION_MAX_AGE_SECONDS;
  }

  appendSetCookie(
    res,
    serializeCookie(SESSION_COOKIE_NAME, token, sessionOptions)
  );

  appendSetCookie(
    res,
    serializeCookie(CSRF_COOKIE_NAME, csrfToken, csrfOptions)
  );
}

function clearAuthCookies(res) {
  const expired = new Date(0);

  appendSetCookie(
    res,
    serializeCookie(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      maxAge: 0,
      expires: expired,
    })
  );

  appendSetCookie(
    res,
    serializeCookie(CSRF_COOKIE_NAME, "", {
      maxAge: 0,
      expires: expired,
    })
  );
}

function parseCookies(req) {
  const header = req.headers.cookie;

  if (typeof header !== "string" || header.length === 0) {
    return {};
  }

  return header.split(";").reduce((cookies, part) => {
    const separatorIndex = part.indexOf("=");

    if (separatorIndex === -1) {
      return cookies;
    }

    const name = part.slice(0, separatorIndex).trim();
    const encodedValue = part
      .slice(separatorIndex + 1)
      .trim();

    try {
      cookies[name] = decodeURIComponent(encodedValue);
    } catch {
      cookies[name] = encodedValue;
    }

    return cookies;
  }, {});
}

function getAuthToken(req) {
  return parseCookies(req)[SESSION_COOKIE_NAME] || null;
}

function hasValidCsrfToken(req) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return true;
  }

  const csrfCookie = parseCookies(req)[CSRF_COOKIE_NAME];
  const csrfHeader = req.headers["x-csrf-token"];

  if (
    typeof csrfCookie !== "string" ||
    typeof csrfHeader !== "string"
  ) {
    return false;
  }

  const cookieBuffer = Buffer.from(csrfCookie);
  const headerBuffer = Buffer.from(csrfHeader);

  return (
    cookieBuffer.length === headerBuffer.length &&
    crypto.timingSafeEqual(cookieBuffer, headerBuffer)
  );
}

module.exports = {
  clearAuthCookies,
  getAuthToken,
  hasValidCsrfToken,
  setAuthCookies,
};
