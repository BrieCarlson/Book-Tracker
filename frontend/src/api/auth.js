const API_URL = "http://localhost:5000/api/auth";

function getAuthHeaders() {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  return token
    ? {
        Authorization: "Bearer " + token,
      }
    : {};
}

async function request(path, options = {}) {
  const response = await fetch(API_URL + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...options.headers,
    },
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

export function updateProfile(profileData) {
  return request("/profile", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  });
}

export function requestEmailChange(emailData) {
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

export function confirmEmailChange(token) {
  return request("/confirm-email-change", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}
