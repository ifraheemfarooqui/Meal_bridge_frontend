function fmt(v) {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d) ? "—" : d.toLocaleString();
}

export default function ReservationTable({ reservations, onCancel }) {
  if (!reservations?.length) return <div className="empty-state">No reservations found.</div>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Student</th><th>Meal</th><th>Date / Time</th><th>Location</th><th>Reserved at</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.studentName || r.studentId}</td>
              <td>{r.mealTitle || r.mealId}</td>
              <td>{r.mealDate || "—"} {r.mealTime || ""}</td>
              <td>{r.location || "—"}</td>
              <td>{fmt(r.createdAt)}</td>
              <td>
                {onCancel && (
                  <button className="btn btn-danger btn-small" onClick={() => onCancel(r)}>
                    Cancel
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
