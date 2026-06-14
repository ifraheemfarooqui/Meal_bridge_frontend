import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { session } from "../services/api";
import { authService } from "../services/authService";
import { mealService } from "../services/mealService";
import { reservationService } from "../services/reservationService";
import { ratingService } from "../services/ratingService";
import MealList from "../components/MealList";
import RatingForm from "../components/RatingForm";
import { normalizeMeals } from "../utils/mealUtils";
import { getAuthState } from "../utils/auth";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(session.getStudent());

  const [meals, setMeals] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [ratingMeal, setRatingMeal] = useState(null);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (getAuthState() !== "student") {
      navigate("/login");
      return;
    }
    setStudent(session.getStudent());
    loadData();
  }, [navigate]);

  async function loadData() {
    setLoading(true);
    try {
      const [mealsRes, resRes] = await Promise.all([
        mealService.getStudentMeals(),
        reservationService.getStudentReservations(),
      ]);
      setMeals(normalizeMeals(mealsRes.meals || []));
      setReservations(resRes.reservations || []);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        authService.logoutStudent();
        navigate("/login");
        return;
      }
      setNotice({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleReserve(meal) {
    setNotice(null);
    try {
      await reservationService.reserveMeal(meal.id);
      await loadData();
      setNotice({ type: "success", message: `Reserved: ${meal.title}` });
    } catch (err) {
      setNotice({ type: "error", message: err.message });
    }
  }

  async function handleCancel(meal) {
    setNotice(null);
    try {
      await reservationService.cancelReservation(meal.id);
      await loadData();
      setNotice({ type: "success", message: "Reservation cancelled." });
    } catch (err) {
      setNotice({ type: "error", message: err.message });
    }
  }

  async function handleRate(mealId, rating, comment) {
    await ratingService.rateMeal(mealId, rating, comment);
    await loadData();
    setRatingMeal(null);
    setNotice({ type: "success", message: "Rating submitted." });
  }

  function handleLogout() {
    authService.logoutStudent();
    navigate("/login");
  }

  if (!student) return null;

  const reservedMealIds = reservations.map((r) => r.mealId);
  const reservedMeals = meals.filter((m) => reservedMealIds.includes(m.id));
  const availableMeals = meals.filter((m) => !reservedMealIds.includes(m.id));

  return (
    <main className="container">
      <section className="page-title">
        <p className="eyebrow">Student dashboard</p>
        <h1>Welcome, {student.fullName}.</h1>
      </section>

      {notice && (
        <div className={`notice show ${notice.type}`} style={{ marginBottom: 16 }}>
          {notice.message}
        </div>
      )}

      <section className="dashboard-layout">
        <aside className="card sidebar">
          <h3>Your profile</h3>
          <p><strong>Status:</strong><br /><span className={`pill ${student.status === "approved" ? "" : "warn"}`}>{student.status}</span></p>
          <p><strong>Email:</strong><br />{student.email}</p>
          <p><strong>Student number:</strong><br />{student.studentNumber}</p>
          <p><strong>Institution:</strong><br />{student.institutionName}</p>
          <p><strong>Location:</strong><br />{student.location}</p>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ marginTop: 12 }}>
            Log out
          </button>
        </aside>

        <div className="grid-2">
          <section className="card">
            <h2>Available meals</h2>
            <p>Reserve an active upcoming meal from the calendar below.</p>
            {loading ? (
              <div className="empty-state">Loading meals...</div>
            ) : (
              <MealList
                meals={availableMeals}
                reservedIds={[]}
                onReserve={handleReserve}
              />
            )}
          </section>

          <section className="card">
            <h2>Your reservations and ratings</h2>
            <p>Your reservations appear here. You can cancel upcoming reservations and rate past meals.</p>
            {ratingMeal && (
              <RatingForm
                meal={ratingMeal}
                onSubmit={handleRate}
                onClose={() => setRatingMeal(null)}
              />
            )}
            {loading ? (
              <div className="empty-state">Loading reservations...</div>
            ) : (
              <MealList
                meals={reservedMeals}
                reservedIds={reservedMealIds}
                onCancel={handleCancel}
                onRate={(meal) => setRatingMeal(meal)}
              />
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
