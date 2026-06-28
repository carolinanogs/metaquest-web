import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
const buttonClass =
  "w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70";

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 350));
}

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();

    if (!email.trim()) {
      setKind("error");
      setMessage("Informe seu e-mail para continuar.");
      return;
    }

    setLoading(true);
    await wait();
    const result = await forgotPassword(email);
    setLoading(false);
    setKind(result.exists ? "success" : "error");
    setMessage(result.message);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@email.com"
          autoComplete="email"
          className={inputClass}
        />
      </div>

      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            kind === "success"
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Enviando..." : "Enviar instruções"}
      </button>

      <p className="text-center text-sm font-semibold">
        <Link to="/login" className="text-indigo-600">
          Voltar para login
        </Link>
      </p>
    </form>
  );
}
