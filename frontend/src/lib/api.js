const API_ROOT = import.meta.env.VITE_API_BASE_URL || "";
const BASE = `${API_ROOT}/api`;

// Prefixes relative /uploads/... paths (returned by the backend) with the backend's
// real address once frontend and backend live on different domains. In local dev,
// API_ROOT is empty and the Vite proxy handles it, so this is a no-op.
export function mediaUrl(path) {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_ROOT}${path}`;
}

function getToken() {
  return localStorage.getItem("rll_admin_token");
}

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${path}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function authedJson(method) {
  return (path, payload) =>
    request(path, {
      method,
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });
}

export const api = {
  station: () => request("/station"),
  settings: () => request("/settings"),
  updateSettings: (payload) => authedJson("PUT")("/settings", payload),
  scheduleAll: () => request("/schedule"),
  scheduleNow: () => request("/schedule/now"),
  presenters: () => request("/presenters"),
  presenter: (id) => request(`/presenters/${id}`),
  news: () => request("/news"),
  article: (slug) => request(`/news/${slug}`),
  contact: (payload) =>
    request("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  // --- Applications (internships / adverts / partnerships) ---
  submitApplication: (payload) =>
    request("/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  uploadApplicationAttachment: async (file) => {
    const formData = new FormData();
    formData.append("attachment", file);
    const res = await fetch(`${BASE}/applications/upload`, { method: "POST", body: formData });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Upload failed");
    }
    return res.json(); // { url }
  },
  applications: () => request("/applications", { headers: authHeaders() }),
  deleteApplication: (id) => request(`/applications/${id}`, { method: "DELETE", headers: authHeaders() }),

  // --- Song requests ---
  submitSongRequest: (payload) =>
    request("/song-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  songRequests: () => request("/song-requests", { headers: authHeaders() }),
  deleteSongRequest: (id) => request(`/song-requests/${id}`, { method: "DELETE", headers: authHeaders() }),
  encouragementToday: () => request("/encouragements/today"),
  encouragements: () => request("/encouragements"),
  createEncouragement: authedJson("POST").bind(null, "/encouragements"),
  updateEncouragement: (id, payload) => authedJson("PUT")(`/encouragements/${id}`, payload),
  deleteEncouragement: (id) => request(`/encouragements/${id}`, { method: "DELETE", headers: authHeaders() }),

  // --- Auth ---
  login: (username, password) =>
    request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }),
  isLoggedIn: () => Boolean(getToken()),
  saveToken: (token) => localStorage.setItem("rll_admin_token", token),
  logout: () => localStorage.removeItem("rll_admin_token"),

  // --- Uploads ---
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${BASE}/upload`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "Upload failed");
    }
    return res.json(); // { url }
  },

  // --- Admin CRUD: presenters ---
  createPresenter: authedJson("POST").bind(null, "/presenters"),
  updatePresenter: (id, payload) => authedJson("PUT")(`/presenters/${id}`, payload),
  deletePresenter: (id) =>
    request(`/presenters/${id}`, { method: "DELETE", headers: authHeaders() }),

  // --- Admin CRUD: schedule ---
  createScheduleEntry: authedJson("POST").bind(null, "/schedule"),
  updateScheduleEntry: (id, payload) => authedJson("PUT")(`/schedule/${id}`, payload),
  deleteScheduleEntry: (id) =>
    request(`/schedule/${id}`, { method: "DELETE", headers: authHeaders() }),

  // --- Admin CRUD: news ---
  createArticle: authedJson("POST").bind(null, "/news"),
  updateArticle: (id, payload) => authedJson("PUT")(`/news/id/${id}`, payload),
  deleteArticle: (id) =>
    request(`/news/id/${id}`, { method: "DELETE", headers: authHeaders() }),
};
