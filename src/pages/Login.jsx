import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { getAuthState } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const state = getAuthState();
    if (state === "student") navigate("/student", { replace: true });
    if (state === "admin") navigate("/admin", { replace: true });
  }, [navigate]);

  return (
    <main className="container">
      <section className="page-title">
        <p className="eyebrow">Student access</p>
        <h1>Log in to reserve meals.</h1>
      </section>
      <LoginForm />
    </main>
  );
}
