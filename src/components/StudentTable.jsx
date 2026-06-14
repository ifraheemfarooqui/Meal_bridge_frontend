function fmt(v) {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d) ? "—" : d.toLocaleString();
}

function statusPill(status) {
  if (status === "removed") return "danger";
  if (status === "pending") return "warn";
  return "";
}

export default function StudentTable({ students, onApprove, onRemove, onDelete }) {
  if (!students?.length) return <div className="empty-state">No students found.</div>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name / ID</th><th>Email / Phone</th><th>CNIC / Age / City</th>
            <th>Institute</th><th>Program / Dietary</th><th>Status</th>
            <th>Registered</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td><strong>{s.fullName || "—"}</strong><br />{s.studentNumber}</td>
              <td>{s.email || "—"}<br />{s.phone || "—"}</td>
              <td>{s.cnic || "—"}<br />{s.age ? `${s.age} yrs` : "—"}<br />{s.city || "—"}</td>
              <td>{s.institutionName || "—"}<br />{s.location || "—"}</td>
              <td>{s.program || "—"}<br />{s.dietaryNeeds || "—"}</td>
              <td>
                <span className={`pill ${statusPill(s.status)}`}>
                  {s.status ? s.status.charAt(0).toUpperCase() + s.status.slice(1) : "Pending"}
                </span>
                {s.removalReason && <><br /><span>{s.removalReason}</span></>}
              </td>
              <td>{fmt(s.createdAt)}</td>
              <td style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {s.status === "pending" && (
                  <button className="btn btn-primary btn-small" onClick={() => onApprove(s)}>
                    Approve
                  </button>
                )}
                {s.status !== "removed" && (
                  <button className="btn btn-secondary btn-small" onClick={() => onRemove(s)}>
                    Remove
                  </button>
                )}
                {onDelete && (
                  <button className="btn btn-danger btn-small" onClick={() => onDelete(s)}>
                    Permanently delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
