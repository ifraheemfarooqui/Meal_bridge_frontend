import StudentTable from "./StudentTable";

export default function ApprovalPanel({ students, onApprove, onRemove, loading }) {
  if (loading) return <div className="empty-state">Loading students...</div>;

  const pending = students.filter((s) => s.status === "pending");
  const others = students.filter((s) => s.status !== "pending");

  return (
    <div>
      {pending.length > 0 && (
        <>
          <h3 style={{ marginBottom: 8 }}>Pending approval ({pending.length})</h3>
          <StudentTable students={pending} onApprove={onApprove} onRemove={onRemove} />
        </>
      )}
      {others.length > 0 && (
        <>
          <h3 style={{ margin: "18px 0 8px" }}>All students</h3>
          <StudentTable students={others} onApprove={onApprove} onRemove={onRemove} />
        </>
      )}
      {!pending.length && !others.length && (
        <div className="empty-state">No students registered yet.</div>
      )}
    </div>
  );
}
