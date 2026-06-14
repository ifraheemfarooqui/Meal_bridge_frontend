import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { getAuthState } from "../utils/auth";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    const state = getAuthState();
    if (state === "student") navigate("/student", { replace: true });
    if (state === "admin") navigate("/admin", { replace: true });
  }, [navigate]);

  return (
    <main className="container">
      <section className="page-title">
        <p className="eyebrow">Student intake</p>
        <h1>Register for MealBridge.</h1>
        <p className="lead">
          Submit your details for admin approval. Approved students can log in, reserve meals, and rate meals.
        </p>
      </section>
      <RegisterForm />
    </main>
  );
}
