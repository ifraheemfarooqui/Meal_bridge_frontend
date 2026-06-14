import { formatMealDate, formatMealTime, isUpcomingMeal, normalizeMeal } from "../utils/mealUtils";

function ratingSummary(meal) {
  if (!meal?.ratingCount) return "No ratings yet";
  return `${Number(meal.averageRating || 0).toFixed(1)} ★ from ${meal.ratingCount} rating${meal.ratingCount === 1 ? "" : "s"}`;
}

export default function MealCard({ meal, reserved, onReserve, onCancel, onRate, showActions = true }) {
  const normalized = normalizeMeal(meal);
  const upcoming = isUpcomingMeal(normalized);
  const reservedCount = Number(normalized.reservedCount || 0);
  const capacity = Number(normalized.capacity || 0);
  const full = capacity > 0 && reservedCount >= capacity;
  const spaces = capacity > 0 ? `${reservedCount}/${capacity} reserved` : `${reservedCount} reserved`;
  const canReserve = !reserved && normalized.status === "active" && upcoming && !full;

  return (
    <article className="card meal-card">
      {normalized.imageUrl && (
        <img className="meal-photo" src={normalized.imageUrl} alt={`Photo of ${normalized.title}`} />
      )}
      <div className="meal-info">
        <h3>{normalized.title}</h3>
        {normalized.description && <p>{normalized.description}</p>}
        <p>
          <strong>{formatMealDate(normalized.date)}</strong> at {formatMealTime(normalized.time)}
        </p>
        <p>{normalized.institutionName} — {normalized.location}</p>
        <p className="meal-meta">{spaces} · {ratingSummary(normalized)}</p>
        <span className={`pill ${normalized.status === "inactive" ? "off" : ""}`}>
          {normalized.status === "active" ? "Active" : "Inactive"}
        </span>
        {!upcoming && <span className="pill warn" style={{ marginLeft: 6 }}>Past</span>}
      </div>

      {showActions && (
        <div className="meal-actions" style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
{reserved ? (
  <>
    <span className="pill">Reserved</span>
    {upcoming && (
      <button className="btn btn-secondary btn-small" onClick={() => onCancel?.(meal)}>
        Cancel reservation
      </button>
    )}
    <button className="btn btn-secondary btn-small" onClick={() => onRate?.(meal)}>
      {upcoming ? "Mark as eaten & rate" : "Rate meal"}
    </button>
  </>
          ) : (
            <button
              className="btn btn-primary btn-small"
              disabled={!canReserve}
              onClick={() => onReserve?.(normalized)}
            >
              {full ? "Fully booked" : !upcoming ? "Past" : "Reserve"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
