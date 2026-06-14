import MealCard from "./MealCard";

export default function MealList({ meals, reservedIds = [], onReserve, onCancel, onRate, showActions = true }) {
  if (!meals?.length) {
    return <div className="empty-state">No meals to display.</div>;
  }

  return (
    <div className="meal-list">
      {meals.map((meal) => (
        <MealCard
          key={meal.id}
          meal={meal}
          reserved={reservedIds.includes(meal.id)}
          onReserve={onReserve}
          onCancel={onCancel}
          onRate={onRate}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
