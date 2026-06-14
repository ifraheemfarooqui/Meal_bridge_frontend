import { session } from "../services/api";

export function getTokenRole() {
  const token = localStorage.getItem("mealbridge_token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}

export function getAuthState() {
  const role = getTokenRole();
  if (role === "ADMIN" && session.getAdmin()) return "admin";
  if (role === "STUDENT" && session.getStudent()) return "student";
  return "guest";
}

export function isAuthenticated() {
  return getAuthState() !== "guest";
}
