import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  timeout: 15000,
});

export const api = {
  projects: () => client.get("/projects/").then((r) => r.data),
  project: (slug) => client.get(`/projects/${slug}/`).then((r) => r.data),
  skills: () => client.get("/skills/").then((r) => r.data),
  experience: () => client.get("/experience/").then((r) => r.data),
  certifications: () => client.get("/certifications/").then((r) => r.data),
  achievements: () => client.get("/achievements/").then((r) => r.data),
  resume: () => client.get("/resume/").then((r) => r.data),
  sendContact: (payload) => client.post("/contact/", payload).then((r) => r.data),
};

/** Turns an Axios error into { message, fieldErrors } for UI states. */
export function parseError(err) {
  if (err.response?.status === 429) return { message: "Too many messages. Please try again later.", fieldErrors: {} };
  if (err.response?.status === 400) {
    const d = err.response.data || {};
    return { message: d.non_field_errors?.[0] || "Please fix the highlighted fields.", fieldErrors: d };
  }
  return { message: err.code === "ERR_NETWORK" ? "Cannot reach the server." : "Something went wrong.", fieldErrors: {} };
}
