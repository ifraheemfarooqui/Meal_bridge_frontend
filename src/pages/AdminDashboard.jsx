import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { session } from "../services/api";
import { authService } from "../services/authService";
import { mealService } from "../services/mealService";
import { studentService } from "../services/studentService";
import MealForm from "../components/MealForm";
import ApprovalPanel from "../components/ApprovalPanel";
import InstitutionTable from "../components/InstitutionTable";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(session.getAdmin());

  // Login form
  const [loginForm, setLoginForm] = useState({ adminId: "", adminPassword: "" });
  const [loginNotice, setLoginNotice] = useState(null);

  // Data
  const [institutions, setInstitutions] = useState([]);
  const [meals, setMeals] = useState([]);
  const [students, setStudents] = useState([]);

  // Meal form
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealNotice, setMealNotice] = useState(null);

  // Institution form
  const [instForm, setInstForm] = useState({ name: "", type: "school", city: "", location: "" });
  const [instNotice, setInstNotice] = useState(null);

  // Notices
  const [studentNotice, setStudentNotice] = useState(null);

  useEffect(() => {
    if (admin) loadAll();
  }, [admin]);

  async function loadAll() {
    try {
      const [instRes, mealRes, studRes] = await Promise.all([
        mealService.getAdminInstitutions(),
        mealService.getAdminMeals(),
        studentService.getStudents(),
      ]);
      setInstitutions(instRes.institutions || []);
      setMeals(mealRes.meals || []);
      setStudents(studRes.students || []);
    } catch (err) {
      if (err.status === 401) { authService.logoutAdmin(); setAdmin(null); }
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginNotice(null);
    try {
      await authService.loginAdmin(loginForm.adminId, loginForm.adminPassword);
      setAdmin(session.getAdmin());
      window.location.reload();
    } catch (err) {
      setLoginNotice({ type: "error", message: err.message });
    }
  }

  async function handleMealSubmit(data, id) {
    setMealNotice(null);
    try {
      if (id) {
        await mealService.updateMeal(id, data);
        setMealNotice({ type: "success", message: "Meal updated." });
      } else {
        await mealService.createMeal(data);
        setMealNotice({ type: "success", message: "Meal added." });
      }
      setEditingMeal(null);
      const res = await mealService.getAdminMeals();
      setMeals(res.meals || []);
    } catch (err) {
      setMealNotice({ type: "error", message: err.message });
    }
  }

  async function handleDeleteMeal(meal) {
    if (!confirm(`Delete "${meal.title}"? This cannot be undone.`)) return;
    try {
      await mealService.deleteMeal(meal.id);
      const res = await mealService.getAdminMeals();
      setMeals(res.meals || []);
    } catch (err) { alert(err.message); }
  }

  async function handleInstSubmit(e) {
    e.preventDefault();
    setInstNotice(null);
    try {
      await mealService.createInstitution(instForm);
      setInstNotice({ type: "success", message: "Institution added." });
      setInstForm({ name: "", type: "school", city: "", location: "" });
      const res = await mealService.getAdminInstitutions();
      setInstitutions(res.institutions || []);
    } catch (err) {
      setInstNotice({ type: "error", message: err.message });
    }
  }

  async function handleApprove(student) {
    try {
      await studentService.approveStudent(student.id);
      setStudentNotice({ type: "success", message: `${student.fullName} approved.` });
      const res = await studentService.getStudents();
      setStudents(res.students || []);
    } catch (err) { setStudentNotice({ type: "error", message: err.message }); }
  }

  async function handleRemoveStudent(student) {
    const reason = prompt(`Reason for removing ${student.fullName}?`);
    if (reason === null) return;
    try {
      await studentService.removeStudent(student.id, reason);
      setStudentNotice({ type: "success", message: `${student.fullName} removed.` });
      const res = await studentService.getStudents();
      setStudents(res.students || []);
    } catch (err) { setStudentNotice({ type: "error", message: err.message }); }
  }

  function setInst(k, v) { setInstForm((p) => ({ ...p, [k]: v })); }

  function handleLogout() {
    authService.logoutAdmin();
    setAdmin(null);
  }

  // ---- LOGIN PANEL ----
  if (!admin) {
    return (
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">MealBridge admin</p>
          <h1>Manage institutions, students, and meals.</h1>
        </section>
        <section className="card form-card">
          <h2>Admin login</h2>
          <p className="lead" style={{ fontSize: "1rem" }}>Use the admin account configured on the server.</p>
          <form onSubmit={handleLogin} className="form-grid">
            <div className="field">
              <label>Admin ID</label>
              <input required placeholder="admin" value={loginForm.adminId}
                onChange={(e) => setLoginForm((p) => ({ ...p, adminId: e.target.value }))} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" required placeholder="admin123" value={loginForm.adminPassword}
                onChange={(e) => setLoginForm((p) => ({ ...p, adminPassword: e.target.value }))} />
            </div>
            <div className="field full">
              <button className="btn btn-primary" type="submit">Log in as admin</button>
              {loginNotice && <div className={`notice show ${loginNotice.type}`}>{loginNotice.message}</div>}
            </div>
          </form>
        </section>
      </main>
    );
  }

  // ---- DASHBOARD ----
  return (
    <main className="container">
      <section className="page-title">
        <p className="eyebrow">MealBridge admin</p>
        <h1>Manage institutions, students, and meals.</h1>
      </section>

      <div className="actions" style={{ justifyContent: "flex-end", marginBottom: 18 }}>
        <Link className="btn btn-secondary" to="/database">Open database</Link>
        <button className="btn btn-secondary" onClick={handleLogout}>Admin log out</button>
      </div>

      {/* Institutions */}
      <section className="card" style={{ marginBottom: 20 }}>
        <h2>Add a school, college, or university</h2>
        <p>Institutions added here power the dropdowns in student registration and meal creation.</p>
        <form onSubmit={handleInstSubmit} className="form-grid">
          <div className="field">
            <label>Institution name</label>
            <input required placeholder="Example: Green Valley University"
              value={instForm.name} onChange={(e) => setInst("name", e.target.value)} />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={instForm.type} onChange={(e) => setInst("type", e.target.value)}>
              <option value="school">School</option>
              <option value="college">College</option>
              <option value="university">University</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="field">
            <label>City</label>
            <input required placeholder="Example: Lahore"
              value={instForm.city} onChange={(e) => setInst("city", e.target.value)} />
          </div>
          <div className="field">
            <label>Location / campus</label>
            <input required placeholder="Example: Main Campus"
              value={instForm.location} onChange={(e) => setInst("location", e.target.value)} />
          </div>
          <div className="field full">
            <button className="btn btn-primary" type="submit">Add institution</button>
            {instNotice && <div className={`notice show ${instNotice.type}`}>{instNotice.message}</div>}
          </div>
        </form>
        <div style={{ marginTop: 18 }}>
          <InstitutionTable institutions={institutions} />
        </div>
      </section>

      {/* Meals */}
      <div className="grid-2">
        <section className="card">
          <h2>{editingMeal ? "Edit meal" : "Add or update a meal"}</h2>
          <p>Meals added here appear on the student meal calendar.</p>
          <MealForm
            institutions={institutions}
            editingMeal={editingMeal}
            onSubmit={handleMealSubmit}
            onCancel={() => setEditingMeal(null)}
            notice={mealNotice}
          />
        </section>

        <section className="card">
          <h2>Meal calendar</h2>
          <p>Edit or delete meals already added to the calendar.</p>
          {meals.length === 0 ? (
            <div className="empty-state">No meals yet.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Title</th><th>Date</th><th>Institution</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {meals.map((m) => (
                    <tr key={m.id}>
                      <td>{m.title}</td>
                      <td>{m.date} {m.time}</td>
                      <td>{m.institutionName}</td>
                      <td><span className={`pill ${m.status === "inactive" ? "off" : ""}`}>{m.status}</span></td>
                      <td style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-secondary btn-small" onClick={() => setEditingMeal(m)}>Edit</button>
                        <button className="btn btn-danger btn-small" onClick={() => handleDeleteMeal(m)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Students */}
      <section className="card" style={{ marginTop: 20 }}>
        <h2>Student approval panel</h2>
        <p>Approve pending entries or remove students from the meal plan.</p>
        {studentNotice && <div className={`notice show ${studentNotice.type}`} style={{ marginBottom: 12 }}>{studentNotice.message}</div>}
        <ApprovalPanel students={students} onApprove={handleApprove} onRemove={handleRemoveStudent} />
      </section>
    </main>
  );
}
