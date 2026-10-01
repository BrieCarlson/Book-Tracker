const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://book-tracker-0of6.onrender.com";

const API_URL = `${API_BASE_URL}/api/auth`;

async function getCsrfToken() {
  const response = await fetch(
    `${API_URL}/csrf`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.csrfToken) {
    throw new Error(
      data.message ||
        "Unable to get the security token. Please log in again."
    );
  }

  return data.csrfToken;
}

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (
    !["GET", "HEAD", "OPTIONS"].includes(method)
  ) {
    headers["X-CSRF-Token"] = await getCsrfToken();
  }

  const response = await fetch(API_URL + path, {
    ...options,
    credentials: "include",
    headers,
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