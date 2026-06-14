import { api, session } from "./api";

export const authService = {
async registerStudent(formData) {
  return api.post("/api/auth/student/register", formData);  // students → student
},

async loginStudent(email, password) {
  session.clearAdmin();
  const data = await api.post("/api/auth/student/login", { email, password });
  localStorage.setItem("mealbridge_token", data.accessToken);
  session.setStudent(data.student);
  return data.student;
},

async loginAdmin(adminId, adminPassword) {
  session.clearStudent();
  const data = await api.post("/api/auth/admin/login", { adminId, password: adminPassword });
  localStorage.setItem("mealbridge_token", data.accessToken);
  session.setAdmin({ adminId });
  return data;
},

  logoutStudent() {
    session.clearStudent();
  },

  logoutAdmin() {
    session.clearAdmin();
  },
};
