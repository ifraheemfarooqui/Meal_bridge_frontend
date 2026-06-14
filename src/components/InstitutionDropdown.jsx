export default function InstitutionDropdown({ institutions, value, onChange, required }) {
  function label(inst) {
    const type = inst.type
      ? inst.type[0].toUpperCase() + inst.type.slice(1)
      : "Institution";
    return `${inst.name} (${type}) — ${inst.city}, ${inst.location}`;
  }

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} required={required}>
      <option value="">Select institution</option>
      {institutions.map((inst) => (
        <option key={inst.id} value={inst.id}>
          {label(inst)}
        </option>
      ))}
    </select>
  );
}
