import { Link } from "react-router-dom";
import { getAuthState } from "../utils/auth";

export default function Footer() {
  const auth = getAuthState(); // "student" | "admin" | null

  return (
    <footer className="site-footer">
      <div className="container footer-inner">

        <div className="footer-brand-col">
          <Link to="/" className="footer-brand">
            <span className="logo-mark">MB</span> MealBridge
          </Link>
          <p className="footer-copy">
            A campus food support platform built for students at MiTE, Karachi.
            Register, get approved, reserve meals, and rate your experience.
          </p>
        </div>

        <div className="footer-links-col">
          <div>
            <h4>Platform</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              {auth !== "admin" && <Link to="/register">Student registration</Link>}
              {auth === "student" && <Link to="/student">My dashboard</Link>}
            </div>
          </div>

          {auth !== "student" && (
            <div>
              <h4>Admin</h4>
              <div className="footer-links">
                <Link to="/admin">Admin panel</Link>
                {auth === "admin" && <Link to="/database">Database</Link>}
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} MealBridge — Campus food support platform.</p>
        <p style={{ opacity: 0.45, fontSize: "0.8rem" }}>Built at MiTE · Karachi, Pakistan</p>
      </div>
    </footer>
  );
}