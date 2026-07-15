export default function InputField({ label, type = 'text', value, onChange, placeholder, name, required }) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-300/80 bg-white/70 px-4 py-2 text-slate-900 outline-none ring-indigo-500 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100"
      />
    </label>
  );
}
