import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import { getAuthState } from "../utils/auth";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(getAuthState());

  useEffect(() => {
    setAuthState(getAuthState());
  }, [pathname]);

  const link = (to, label) => (
    <Link className={pathname === to ? "active" : ""} to={to}>
      {label}
    </Link>
  );

  function handleLogout() {
    if (authState === "admin") authService.logoutAdmin();
    else authService.logoutStudent();
    setAuthState("guest");
    navigate("/");
    window.location.reload();
  }

  return (
    <header className="site-header">
      <div className="container navbar">
        <Link className="logo" to="/">
          <span className="logo-mark">MB</span> MealBridge
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {link("/", "Home")}

          {authState === "guest" && (
            <>
              {link("/login", "Log in")}
              {link("/register", "Sign up")}
              {link("/admin", "Admin")}
            </>
          )}

          {authState === "student" && (
            <>
              {link("/student", "My dashboard")}
              <button type="button" className="nav-btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          )}

          {authState === "admin" && (
            <>
              {link("/admin", "Admin panel")}
              {link("/database", "Database")}
              <button type="button" className="nav-btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
