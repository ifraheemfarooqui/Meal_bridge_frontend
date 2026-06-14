import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MealList from "../components/MealList";
import { mealService } from "../services/mealService";
import { studentService } from "../services/studentService";
import { reservationService } from "../services/reservationService";
import { normalizeMeals } from "../utils/mealUtils";
import { getAuthState } from "../utils/auth";

export default function Home() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authState = getAuthState();

  // Admin counts
  const [adminCounts, setAdminCounts] = useState({ institutions: 0, students: 0, meals: 0 });

  // Student counts
  const [studentCounts, setStudentCounts] = useState({ meals: 0, reservations: 0, ratings: 0 });

  useEffect(() => {
    mealService
      .getPublicMeals()
      .then((d) => setMeals(normalizeMeals(d.meals || [])))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    if (authState === "admin") {
      Promise.all([
        mealService.getAdminInstitutions(),
        studentService.getStudents(),
        mealService.getAdminMeals(),
      ]).then(([instRes, studRes, mealRes]) => {
        setAdminCounts({
          institutions: instRes.institutions?.length || 0,
          students: studRes.students?.length || 0,
          meals: mealRes.meals?.length || 0,
        });
      }).catch(() => {});
    }

    if (authState === "student") {
      Promise.all([
        mealService.getStudentMeals(),
        reservationService.getStudentReservations(),
      ]).then(([mealRes, resRes]) => {
        const reservations = resRes.reservations || [];
        const rated = reservations.filter((r) => r.rated).length;
        setStudentCounts({
          meals: mealRes.meals?.length || 0,
          reservations: reservations.length,
          ratings: rated,
        });
      }).catch(() => {});
    }
  }, [authState]);

  // ── STUDENT VIEW ──────────────────────────────────────────────────────────
  if (authState === "student") {
    return (
      <main>
        <section className="container hero">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>Your meal dashboard.</h1>
            <p className="lead">
              Browse upcoming meals at your institution, reserve a spot, and rate meals
              you've eaten. Your reservations and ratings are tracked in your dashboard.
            </p>
            <div className="actions">
              <Link className="btn btn-primary" to="/student">Go to my dashboard</Link>
            </div>
          </div>
          <aside className="hero-card" aria-label="Student quick info">
            <div className="food-panel"></div>
            <div className="stats-grid">
              <div className="stat"><strong>{studentCounts.meals}</strong><span>Meals available</span></div>
              <div className="stat"><strong>{studentCounts.reservations}</strong><span>Reservations</span></div>
              <div className="stat"><strong>{studentCounts.ratings}</strong><span>Ratings given</span></div>
            </div>
            <p className="lead" style={{ fontSize: "1rem", marginBottom: 0 }}>
              Only approved students can reserve meals. Check your dashboard for your status.
            </p>
          </aside>
        </section>

        <section className="container section">
          <p className="eyebrow">What you can do</p>
          <h2>Your student tools.</h2>
          <div className="grid-3">
            <article className="card">
              <h3>View meal calendar</h3>
              <p>See all upcoming meals at your institution — date, time, location, capacity, and photos.</p>
            </article>
            <article className="card">
              <h3>Reserve a meal</h3>
              <p>Reserve your spot before meals fill up. Cancel anytime before the meal date.</p>
            </article>
            <article className="card">
              <h3>Rate meals</h3>
              <p>After eating, leave a star rating and comment to help improve the meal program.</p>
            </article>
          </div>
        </section>

        <section className="container section" id="meals">
          <p className="eyebrow">Upcoming meals</p>
          <h2>Meal calendar preview.</h2>
          <p className="lead" style={{ fontSize: "1rem" }}>
            Log in to your dashboard to reserve any of the meals below.
          </p>
          <div style={{ marginTop: 24 }}>
            {loading && <div className="empty-state">Loading meals...</div>}
            {!loading && error && <div className="notice show error">{error}</div>}
            {!loading && !error && <MealList meals={meals} showActions={false} />}
          </div>
        </section>
      </main>
    );
  }

  // ── ADMIN VIEW ────────────────────────────────────────────────────────────
  if (authState === "admin") {
    return (
      <main>
        <section className="container hero">
          <div>
            <p className="eyebrow">Admin panel</p>
            <h1>Manage MealBridge.</h1>
            <p className="lead">
              Add institutions, approve or remove students, create and update meals,
              upload meal photos, and monitor the full student database.
            </p>
            <div className="actions">
              <Link className="btn btn-primary" to="/admin">Go to admin panel</Link>
              <Link className="btn btn-secondary" to="/database">Open database</Link>
            </div>
          </div>
          <aside className="hero-card" aria-label="Admin quick info">
            <div className="food-panel"></div>
            <div className="stats-grid">
              <div className="stat"><strong>{adminCounts.institutions}</strong><span>Institutions</span></div>
              <div className="stat"><strong>{adminCounts.students}</strong><span>Students</span></div>
              <div className="stat"><strong>{adminCounts.meals}</strong><span>Meals</span></div>
            </div>
            <p className="lead" style={{ fontSize: "1rem", marginBottom: 0 }}>
              All platform management lives in the admin panel and database view.
            </p>
          </aside>
        </section>

        <section className="container section">
          <p className="eyebrow">Admin tools</p>
          <h2>Everything you can manage.</h2>
          <div className="grid-3">
            <article className="card">
              <h3>Institutions</h3>
              <p>Add schools, colleges, and universities. Students register under an institution and meals are tied to one.</p>
              <Link className="btn btn-secondary btn-small" to="/admin" style={{ marginTop: 16, display: "inline-flex" }}>
                Manage institutions
              </Link>
            </article>
            <article className="card">
              <h3>Student approvals</h3>
              <p>Review pending registrations and approve or remove students from the meal plan.</p>
              <Link className="btn btn-secondary btn-small" to="/admin" style={{ marginTop: 16, display: "inline-flex" }}>
                Review students
              </Link>
            </article>
            <article className="card">
              <h3>Meal calendar</h3>
              <p>Create, edit, and delete meals. Set dates, times, capacity, and upload meal photos.</p>
              <Link className="btn btn-secondary btn-small" to="/admin" style={{ marginTop: 16, display: "inline-flex" }}>
                Manage meals
              </Link>
            </article>
          </div>
        </section>

        <section className="container section" id="meals">
          <p className="eyebrow">Live meal calendar</p>
          <h2>Current upcoming meals.</h2>
          <p className="lead" style={{ fontSize: "1rem" }}>
            This is what students see on the public meal calendar right now.
          </p>
          <div style={{ marginTop: 24 }}>
            {loading && <div className="empty-state">Loading meals...</div>}
            {!loading && error && <div className="notice show error">{error}</div>}
            {!loading && !error && <MealList meals={meals} showActions={false} />}
          </div>
        </section>
      </main>
    );
  }

  // ── GUEST VIEW ────────────────────────────────────────────────────────────
  return (
    <main>
      <section className="container hero">
        <div>
          <p className="eyebrow">Campus food support platform</p>
          <h1>Connect students with available meals.</h1>
          <p className="lead">
            MealBridge lets students register for campus meal support, reserve upcoming
            meals at their institution, and rate their experience — all in one place.
          </p>
          <div className="actions">
            <Link className="btn btn-primary" to="/register">Register as a student</Link>
            <Link className="btn btn-secondary" to="/login">Student login</Link>
            <Link className="btn btn-secondary" to="/admin">Admin login</Link>
          </div>
        </div>
        <aside className="hero-card" aria-label="MealBridge overview">
          <div className="food-panel"></div>
          <div className="stats-grid">
            <div className="stat"><strong>01</strong><span>Register</span></div>
            <div className="stat"><strong>02</strong><span>View meals</span></div>
            <div className="stat"><strong>03</strong><span>Reserve</span></div>
          </div>
          <p className="lead" style={{ fontSize: "1rem", marginBottom: 0 }}>
            MealBridge connects students with available campus meals.
          </p>
        </aside>
      </section>

      <section className="container section">
        <p className="eyebrow">How it works</p>
        <h2>Simple tools for students and admins.</h2>
        <div className="grid-3">
          <article className="card">
            <h3>Student registration</h3>
            <p>Submit your institution, CNIC, age, city, and contact details. Admins approve your entry before you join the meal plan.</p>
          </article>
          <article className="card">
            <h3>Meal calendar</h3>
            <p>Browse upcoming meals with institution, date, time, location, capacity, ratings, and meal photos.</p>
          </article>
          <article className="card">
            <h3>Admin management</h3>
            <p>Admins manage institutions, approve students, upload meal photos, and keep the calendar up to date.</p>
          </article>
        </div>
      </section>

      <section className="container section" id="meals">
        <p className="eyebrow">Upcoming meals</p>
        <h2>Meal calendar preview.</h2>
        <p className="lead" style={{ fontSize: "1rem" }}>
          Browse upcoming meals without signing in. Register and get approved to reserve a spot.
        </p>
        <div style={{ marginTop: 24 }}>
          {loading && <div className="empty-state">Loading meals...</div>}
          {!loading && error && <div className="notice show error">{error}</div>}
          {!loading && !error && <MealList meals={meals} showActions={false} />}
        </div>
      </section>
    </main>
  );
}