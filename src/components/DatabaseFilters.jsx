import { useState } from "react";

export default function DatabaseFilters({ title, fields, onFilter, onReset }) {
  const [form, setForm] = useState({});

  function set(k, v) { setForm((p) => ({ ...p, [k]: v })); }

  function handleSubmit(e) {
    e.preventDefault();
    const clean = Object.fromEntries(Object.entries(form).filter(([, v]) => v));
    onFilter(clean);
  }

  function handleReset() {
    setForm({});
    onReset();
  }

  return (
    <form onSubmit={handleSubmit} className="form-grid compact-form">
      {fields.map((f) => (
        <div key={f.name} className="field">
          <label>{f.label}</label>
          {f.type === "select" ? (
            <select value={form[f.name] || ""} onChange={(e) => set(f.name, e.target.value)}>
              {f.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={f.type || "text"}
              value={form[f.name] || ""}
              onChange={(e) => set(f.name, e.target.value)}
              placeholder={f.placeholder}
              min={f.min}
            />
          )}
        </div>
      ))}
      <div className="field" style={{ alignSelf: "end" }}>
        <button className="btn btn-primary" type="submit">Filter {title}</button>
      </div>
      <div className="field" style={{ alignSelf: "end" }}>
        <button className="btn btn-secondary" type="button" onClick={handleReset}>
          Reset filters
        </button>
      </div>
    </form>
  );
}
