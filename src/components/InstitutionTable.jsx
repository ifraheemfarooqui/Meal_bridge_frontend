function fmt(v) {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d) ? "—" : d.toLocaleString();
}

export default function InstitutionTable({ institutions, onRemove, onDelete }) {
  if (!institutions?.length) return <div className="empty-state">No institutions found.</div>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Institution</th><th>Type</th><th>City</th><th>Location</th>
            <th>Status</th><th>Added</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {institutions.map((inst) => (
            <tr key={inst.id}>
              <td><strong>{inst.name || "—"}</strong></td>
              <td>{inst.type || "—"}</td>
              <td>{inst.city || "—"}</td>
              <td>{inst.location || "—"}</td>
              <td>
                <span className={`pill ${inst.status === "removed" ? "danger" : ""}`}>
                  {inst.status === "removed" ? "Removed" : "Active"}
                </span>
                {inst.removalReason && <><br /><span>{inst.removalReason}</span></>}
              </td>
              <td>{fmt(inst.createdAt)}</td>
              <td style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {inst.status !== "removed" && onRemove && (
                  <button className="btn btn-secondary btn-small" onClick={() => onRemove(inst)}>
                    Remove
                  </button>
                )}
                {onDelete && (
                  <button className="btn btn-danger btn-small" onClick={() => onDelete(inst)}>
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
