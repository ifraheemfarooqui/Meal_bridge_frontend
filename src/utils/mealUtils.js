export function parseMealDateTime(meal) {
  if (!meal?.date || !meal?.time) return null;
  const time = String(meal.time).length === 5 ? `${meal.time}:00` : String(meal.time);
  const dt = new Date(`${meal.date}T${time}`);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export function isUpcomingMeal(meal) {
  const dt = parseMealDateTime(meal);
  return dt ? dt.getTime() >= Date.now() : false;
}

export function formatMealDate(date) {
  if (!date) return "Date not set";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "Date not set";
  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMealTime(time) {
  if (!time) return "";
  const parts = String(time).split(":");
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
  return String(time);
}

export function normalizeMeal(meal) {
  if (!meal) return meal;
  return {
    ...meal,
    reservedCount: meal.reservedCount ?? meal.reservationCount ?? 0,
  };
}

export function normalizeMeals(meals = []) {
  return meals.map(normalizeMeal);
}
