import { api, session } from "./api";

export const reservationService = {
  async getStudentReservations() {
    return api.get("/api/student/reservations");
  },

  async reserveMeal(mealId) {
    return api.post("/api/student/reservations", { mealId });
  },

  async cancelReservation(mealId) {
    return api.delete(`/api/student/reservations/${mealId}`);
  },
};
