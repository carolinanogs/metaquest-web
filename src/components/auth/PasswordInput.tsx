import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
};

export function PasswordInput({ id, value, onChange, placeholder, autoComplete }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-base outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
      >
        <Icon className="h-4 w-4" />
      </button>
    </div>
  );
}
