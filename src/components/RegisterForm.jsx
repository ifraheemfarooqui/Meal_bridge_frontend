import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/authService";
import { mealService } from "../services/mealService";
import InstitutionDropdown from "./InstitutionDropdown";

export default function RegisterForm() {
  const [institutions, setInstitutions] = useState([]);
  const [form, setForm] = useState({
    fullName: "", studentNumber: "", email: "", password: "",
    institutionId: "", cnic: "", age: "", city: "", phone: "", program: "", dietaryNeeds: "",
  });
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mealService.getInstitutions().then((d) => setInstitutions(d.institutions || [])).catch(() => {});
  }, []);

  function set(k, v) { setForm((p) => ({ ...p, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setNotice(null);
    try {
      const inst = institutions.find((i) => i.id === form.institutionId);
      await authService.registerStudent({ ...form, location: inst?.location || "" });
      setNotice({ type: "success", message: "Registration submitted! Awaiting admin approval." });
      setForm({ fullName: "", studentNumber: "", email: "", password: "", institutionId: "", cnic: "", age: "", city: "", phone: "", program: "", dietaryNeeds: "" });
    } catch (err) {
      setNotice({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  const location = institutions.find((i) => i.id === form.institutionId)?.location || "";

  return (
    <section className="card form-card">
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="field">
          <label>Full name</label>
          <input autoComplete="name" required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
        </div>
        <div className="field">
          <label>Student number</label>
          <input required value={form.studentNumber} onChange={(e) => set("studentNumber", e.target.value)} />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" autoComplete="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" autoComplete="new-password" required value={form.password} onChange={(e) => set("password", e.target.value)} />
        </div>
        <div className="field">
          <label>Institution</label>
          <InstitutionDropdown institutions={institutions} value={form.institutionId} onChange={(v) => set("institutionId", v)} required />
        </div>
        <div className="field">
          <label>Location / campus</label>
          <input value={location} readOnly placeholder="Auto-filled from institution" />
        </div>
        <div className="field">
          <label>CNIC number</label>
          <input inputMode="numeric" placeholder="13 digits" required value={form.cnic} onChange={(e) => set("cnic", e.target.value)} />
        </div>
        <div className="field">
          <label>Age</label>
          <input type="number" min="10" max="120" required value={form.age} onChange={(e) => set("age", e.target.value)} />
        </div>
        <div className="field">
          <label>City</label>
          <input autoComplete="address-level2" required value={form.city} onChange={(e) => set("city", e.target.value)} />
        </div>
        <div className="field">
          <label>Phone</label>
          <input autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div className="field full">
          <label>Program / course</label>
          <input value={form.program} onChange={(e) => set("program", e.target.value)} />
        </div>
        <div className="field full">
          <label>Dietary needs</label>
          <textarea placeholder="Example: vegetarian, halal, allergies, no restrictions"
            value={form.dietaryNeeds} onChange={(e) => set("dietaryNeeds", e.target.value)} />
        </div>
        <div className="field full">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit registration for approval"}
          </button>
          <p>Already approved? <Link to="/login">Log in here</Link>.</p>
          {notice && <div className={`notice show ${notice.type}`}>{notice.message}</div>}
        </div>
      </form>
    </section>
  );
}
