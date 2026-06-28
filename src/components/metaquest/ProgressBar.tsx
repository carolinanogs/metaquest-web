interface Props {
  value: number; // 0-100
  className?: string;
  gradient?: boolean;
}

export function ProgressBar({ value, className = "", gradient = true }: Props) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-slate-200/70 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${
          gradient ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400" : "bg-indigo-500"
        }`}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
