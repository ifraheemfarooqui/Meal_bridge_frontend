import { api, session } from "./api";

export const ratingService = {
  async rateMeal(mealId, rating, comment = "") {
    return api.post("/api/student/ratings", { mealId, rating, comment });
  },
};
