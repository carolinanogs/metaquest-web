import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { PasswordInput } from "./PasswordInput";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
const buttonClass =
  "w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70";

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 350));
}

export function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Informe seu e-mail para entrar.");
      return;
    }
    if (!password) {
      setError("Informe sua senha para continuar.");
      return;
    }

    setLoading(true);
    await wait();
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message ?? "Não foi possível entrar.");
      return;
    }

    toast.success("Login realizado com sucesso!");
    navigate({ to: "/dashboard", replace: true });
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

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-semibold text-slate-700">
          Senha
        </label>
        <PasswordInput
          id="password"
          value={password}
          onChange={setPassword}
          placeholder="Sua senha"
          autoComplete="current-password"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <div className="flex items-center justify-between text-sm font-semibold">
        <Link to="/register" className="text-indigo-600">
          Criar conta
        </Link>
        <Link to="/forgot-password" className="text-slate-500">
          Esqueci minha senha
        </Link>
      </div>
    </form>
  );
}
