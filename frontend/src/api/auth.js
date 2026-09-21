const API_URL = "http://localhost:5000/api/auth";

function getCookie(name) {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const separatorIndex = cookie.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const cookieName = cookie
      .slice(0, separatorIndex)
      .trim();

    if (cookieName !== name) {
      continue;
    }

    return decodeURIComponent(
      cookie.slice(separatorIndex + 1).trim()
    );
  }

  return "";
}

function getRequestHeaders(options) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const method = (options.method || "GET").toUpperCase();
  const csrfToken = getCookie("book_tracker_csrf");

  if (
    !["GET", "HEAD", "OPTIONS"].includes(method) &&
    csrfToken
  ) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  return headers;
}

async function request(path, options = {}) {
  const response = await fetch(API_URL + path, {
    ...options,
    credentials: "include",
    headers: getRequestHeaders(options),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Request failed. Please try again."
    );
  }

  return data;
}

export function register(userData) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function login(userData) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function getCurrentUser() {
  return request("/me");
}

export function logout() {
  return request("/logout", {
    method: "POST",
  });
}

export function updateProfile(profileData) {
  return request("/profile", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  });
}

export function updateEmail(emailData) {
  return request("/profile/email-change", {
    method: "POST",
    body: JSON.stringify(emailData),
  });
}

export function changePassword(passwordData) {
  return request("/profile/password", {
    method: "POST",
    body: JSON.stringify(passwordData),
  });
}
