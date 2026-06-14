import { api, publicApi } from "./api";

export const mealService = {
  async getPublicMeals() {
    return publicApi.get("/api/meals");
  },

  async getInstitutions() {
    return publicApi.get("/api/institutions");
  },

  async getStudentMeals() {
    return api.get("/api/student/meals");
  },

  async getAdminMeals(params = {}) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/admin/meals${query ? `?${query}` : ""}`);
  },

  async createMeal(mealData) {
    return api.post("/api/admin/meals", mealData);
  },

  async updateMeal(id, mealData) {
    return api.put(`/api/admin/meals/${id}`, mealData);
  },

  async deleteMeal(id) {
    return api.delete(`/api/admin/meals/${id}`);
  },

  async getAdminInstitutions() {
    return api.get("/api/admin/institutions");
  },

  async createInstitution(data) {
    return api.post("/api/admin/institutions", data);
  },

  async removeInstitution(id, reason) {
    return api.put(`/api/admin/institutions/${id}/remove`, { reason });
  },

  async permanentDeleteInstitution(id) {
    return api.delete(`/api/admin/database/institutions/${id}/permanent`);
  },
};
