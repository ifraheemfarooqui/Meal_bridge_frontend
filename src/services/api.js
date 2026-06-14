const BASE_URL = "http://localhost:8080";

function getAuthHeaders() {
  const token = localStorage.getItem("mealbridge_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}, { auth = true } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(auth ? getAuthHeaders() : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || "Something went wrong.");
    error.status = response.status;
    throw error;
  }
  return data;
}

export const api = {
  get: (path, options = {}) => request(path, { ...options, method: "GET" }),
  post: (path, body, options = {}) =>
    request(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: (path, body, options = {}) =>
    request(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: (path, options = {}) => request(path, { ...options, method: "DELETE" }),
};

/** Public endpoints — never send JWT so stale tokens cannot block home/register. */
export const publicApi = {
  get: (path, options = {}) =>
    request(path, { ...options, method: "GET" }, { auth: false }),
};

export const session = {
  getStudent() {
    try {
      return JSON.parse(localStorage.getItem("mealbridgeStudent") || "null");
    } catch {
      localStorage.removeItem("mealbridgeStudent");
      return null;
    }
  },
  setStudent(s) {
    localStorage.setItem("mealbridgeStudent", JSON.stringify(s));
  },
  clearStudent() {
    localStorage.removeItem("mealbridgeStudent");
    localStorage.removeItem("mealbridge_token");
  },

  getAdmin() {
    try {
      return JSON.parse(localStorage.getItem("mealbridgeAdmin") || "null");
    } catch {
      localStorage.removeItem("mealbridgeAdmin");
      return null;
    }
  },
  setAdmin(a) {
    localStorage.setItem("mealbridgeAdmin", JSON.stringify(a));
  },
  clearAdmin() {
    localStorage.removeItem("mealbridgeAdmin");
    localStorage.removeItem("mealbridge_token");
  },

  clearAll() {
    localStorage.removeItem("mealbridgeStudent");
    localStorage.removeItem("mealbridgeAdmin");
    localStorage.removeItem("mealbridge_token");
  },
};
