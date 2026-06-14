import { api, session } from "./api";

export const studentService = {
  async getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/admin/students${query ? `?${query}` : ""}`);
  },

  async approveStudent(id) {
    return api.put(`/api/admin/students/${id}/approve`, {});
  },

  async removeStudent(id, reason) {
    return api.put(`/api/admin/students/${id}/remove`, { reason });
  },

  async permanentDeleteStudent(id) {
    return api.delete(`/api/admin/database/students/${id}/permanent`);
  },
};
