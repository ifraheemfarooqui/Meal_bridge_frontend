import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function set(k, v) { setForm((p) => ({ ...p, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setNotice(null);
    try {
      await authService.loginStudent(form.email, form.password);
      navigate("/student");
    } catch (err) {
      setNotice({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card form-card">
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="field full">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" required
            value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="field full">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" required
            value={form.password} onChange={(e) => set("password", e.target.value)} />
        </div>
        <div className="field full">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
          <p>New student? <Link to="/register">Register first</Link>.</p>
          {notice && <div className={`notice show ${notice.type}`}>{notice.message}</div>}
        </div>
      </form>
    </section>
  );
}
