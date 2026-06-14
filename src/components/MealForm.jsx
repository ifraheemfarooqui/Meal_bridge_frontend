import { useState, useEffect } from "react";
import InstitutionDropdown from "./InstitutionDropdown";

export default function MealForm({ institutions, editingMeal, onSubmit, onCancel, notice }) {
  const [form, setForm] = useState({
    title: "", description: "", date: "", time: "",
    institutionId: "", location: "", capacity: "", status: "active",  imageUrl: "",
  });

  useEffect(() => {
    if (editingMeal) {
      setForm({
        title: editingMeal.title || "",
        description: editingMeal.description || "",
        date: editingMeal.date || "",
        time: editingMeal.time || "",
        institutionId: editingMeal.institutionId || "",
        location: editingMeal.location || "",
        capacity: editingMeal.capacity ?? "",
        status: editingMeal.status || "active",
        imageUrl: editingMeal.imageUrl || "",
      });
    } else {
      setForm({ title: "", description: "", date: "", time: "", institutionId: "", location: "", capacity: "", status: "active", imageUrl: "" });
    }
  }, [editingMeal]);

  function set(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "institutionId") {
        const inst = institutions.find((i) => i.id === value);
        next.location = inst?.location || "";
      }
      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...form, capacity: Number(form.capacity || 0) }, editingMeal?.id);
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <div className="field full">
        <label>Meal title</label>
        <input value={form.title} onChange={(e) => set("title", e.target.value)} required placeholder="Example: Hot lunch" />
      </div>
      <div className="field">
        <label>Date</label>
        <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
      </div>
      <div className="field">
        <label>Time</label>
        <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} required />
      </div>
      <div className="field">
        <label>Institution</label>
        <InstitutionDropdown
          institutions={institutions}
          value={form.institutionId}
          onChange={(v) => set("institutionId", v)}
          required
        />
      </div>
      <div className="field">
        <label>Location / campus</label>
        <input value={form.location} readOnly placeholder="Auto-filled from institution" />
      </div>
      <div className="field">
        <label>Capacity</label>
        <input type="number" min="0" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} placeholder="0 = no limit" />
      </div>
      <div className="field">
        <label>Status</label>
        <select value={form.status} onChange={(e) => set("status", e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="field full">
        <label>Description</label>
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>
<div className="field full">
  <label>Meal image <span style={{ fontWeight: 400, opacity: 0.6 }}>(optional)</span></label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => set("imageUrl", reader.result); // Base64
      reader.readAsDataURL(file);
    }}
  />
  {form.imageUrl && (
    <img src={form.imageUrl} alt="Preview" style={{ marginTop: 8, maxHeight: 160, borderRadius: 8, objectFit: "cover" }} />
  )}
</div>
      <div className="field" style={{ alignSelf: "end" }}>
        <button className="btn btn-primary" type="submit">
          {editingMeal ? "Update meal" : "Add meal"}
        </button>
      </div>
      {editingMeal && (
        <div className="field" style={{ alignSelf: "end" }}>
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Cancel edit
          </button>
        </div>
      )}
      {notice && (
        <div className="field full">
          <div className={`notice show ${notice.type}`}>{notice.message}</div>
        </div>
      )}
    </form>
  );
}
