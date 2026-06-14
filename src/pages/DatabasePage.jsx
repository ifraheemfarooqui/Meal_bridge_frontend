import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { session } from "../services/api";
import { authService } from "../services/authService";
import { studentService } from "../services/studentService";
import { mealService } from "../services/mealService";
import StudentTable from "../components/StudentTable";
import InstitutionTable from "../components/InstitutionTable";
import DatabaseFilters from "../components/DatabaseFilters";

const STUDENT_FIELDS = [
  { name: "institutionId", label: "Institute", type: "text", placeholder: "Institution ID" },
  { name: "status", label: "Status", type: "select", options: [
    { value: "", label: "All students" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "removed", label: "Removed" },
  ]},
  { name: "name", label: "Name", placeholder: "Search name" },
  { name: "email", label: "Email", placeholder: "Search email" },
];

const INSTITUTION_FIELDS = [
  { name: "name", label: "Institute name", placeholder: "Search institute" },
  { name: "city", label: "City", placeholder: "Search city" },
  { name: "type", label: "Type", type: "select", options: [
    { value: "", label: "All types" },
    { value: "school", label: "School" },
    { value: "college", label: "College" },
    { value: "university", label: "University" },
    { value: "other", label: "Other" },
  ]},
  { name: "status", label: "Status", type: "select", options: [
    { value: "", label: "All institutes" },
    { value: "active", label: "Active" },
    { value: "removed", label: "Removed" },
  ]},
];

export default function DatabasePage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(session.getAdmin());
  const [students, setStudents] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [notice, setNotice] = useState(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!admin) return;
    verifyAndLoad();
  }, [admin]);

async function verifyAndLoad() {
  try {
    setVerified(true);
    await loadAll({}, {});
  } catch (err) {
    setNotice({ type: "error", message: err.message });
  }
}

  async function loadAll(studentParams = {}, instParams = {}) {
    try {
      const [studRes, instRes] = await Promise.all([
        studentService.getStudents(studentParams),
        mealService.getAdminInstitutions(),
      ]);
      setStudents(studRes.students || []);
      setInstitutions(instRes.institutions || []);
    } catch (err) {
      if (err.status === 401) { authService.logoutAdmin(); setAdmin(null); }
      else setNotice({ type: "error", message: err.message });
    }
  }

  async function handleDeleteStudent(student) {
    if (!confirm(`Permanently delete ${student.fullName}? This cannot be undone.`)) return;
    try {
      await studentService.permanentDeleteStudent(student.id);
      await loadAll();
    } catch (err) { alert(err.message); }
  }

  async function handleDeleteInstitution(inst) {
    if (!confirm(`Permanently delete ${inst.name}? This deletes all its students, meals, reservations, and ratings.`)) return;
    try {
      await mealService.permanentDeleteInstitution(inst.id);
      await loadAll();
    } catch (err) { alert(err.message); }
  }

  // ---- NOT LOGGED IN ----
  if (!admin || !verified) {
    return (
      <main className="container">
        <section className="page-title">
          <p className="eyebrow">Admin database</p>
          <h1>Search students and institutions.</h1>
        </section>
        <section className="card form-card">
          <h2>Admin access required</h2>
          <p className="lead" style={{ fontSize: "1rem" }}>
            Log in from the admin panel first, then return here to view the database tables.
          </p>
          <div className="actions">
            <Link className="btn btn-primary" to="/admin">Go to admin login</Link>
          </div>
          {notice && <div className={`notice show ${notice.type}`}>{notice.message}</div>}
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="page-title">
        <p className="eyebrow">Admin database</p>
        <h1>Search students and institutions.</h1>
        <p className="lead">
          The starting tables show all records, including removed records. Use filters to narrow each table.
          Permanent delete actions erase records from the database.
        </p>
      </section>

      <div className="actions" style={{ justifyContent: "flex-end", marginBottom: 18 }}>
        <Link className="btn btn-secondary" to="/admin">Back to admin panel</Link>
        <button className="btn btn-secondary" onClick={() => { authService.logoutAdmin(); navigate("/admin"); }}>
          Admin log out
        </button>
      </div>

      {/* Students table */}
      <section className="card database-block">
        <h2>Students table</h2>
        <p>Initially shows every student including pending, approved, and removed.</p>
        <DatabaseFilters
          title="students"
          fields={STUDENT_FIELDS}
          onFilter={(params) => loadAll(params, {})}
          onReset={() => loadAll({}, {})}
        />
        <div style={{ marginTop: 18 }}>
          <StudentTable students={students} onDelete={handleDeleteStudent} />
        </div>
      </section>

      {/* Institutions table */}
      <section className="card database-block" style={{ marginTop: 20 }}>
        <h2>Institutes table</h2>
        <p>Initially shows every institution including removed ones. Permanently deleting an institute also erases its students, meals, reservations, and ratings.</p>
        <DatabaseFilters
          title="institutes"
          fields={INSTITUTION_FIELDS}
          onFilter={(params) => loadAll({}, params)}
          onReset={() => loadAll({}, {})}
        />
        <div style={{ marginTop: 18 }}>
          <InstitutionTable institutions={institutions} onDelete={handleDeleteInstitution} />
        </div>
      </section>
    </main>
  );
}
