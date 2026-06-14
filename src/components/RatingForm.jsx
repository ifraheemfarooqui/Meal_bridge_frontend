import { useState } from "react";

export default function RatingForm({ meal, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [notice, setNotice] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return setNotice({ type: "error", message: "Please select a star rating." });
    try {
      await onSubmit(meal.id, rating, comment);
      setNotice({ type: "success", message: "Rating submitted!" });
      setTimeout(onClose, 1000);
    } catch (err) {
      setNotice({ type: "error", message: err.message });
    }
  }

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h3>Rate: {meal.title}</h3>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="field full">
          <label>Star rating</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                type="button"
                className={`btn btn-small ${rating === v ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setRating(v)}
              >
                {v} ★
              </button>
            ))}
          </div>
        </div>
        <div className="field full">
          <label>Comment (optional)</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <div className="field full" style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" type="submit">Submit rating</button>
          <button className="btn btn-secondary" type="button" onClick={onClose}>Cancel</button>
        </div>
        {notice && <div className={`notice show ${notice.type}`}>{notice.message}</div>}
      </form>
    </div>
  );
}
