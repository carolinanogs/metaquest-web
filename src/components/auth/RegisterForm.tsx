import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { isValidEmail, useAuth } from "@/lib/auth";
import { PasswordInput } from "./PasswordInput";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
const buttonClass =
  "w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70";

function wait() {
  return new Promise((resolve) => setTimeout(resolve, 350));
}

export function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Informe seu nome para criar a conta.");
      return;
    }
    if (!email.trim()) {
      setError("Informe seu e-mail para criar a conta.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Informe um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    setLoading(true);
    await wait();
    const result = await register({ name, email, password });
    setLoading(false);

    if (!result.success) {
      setError(result.message ?? "Não foi possível criar a conta.");
      return;
    }

    toast.success("Conta criada com sucesso!");
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-semibold text-slate-700">
          Nome
        </label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Seu nome"
          autoComplete="name"
          className={inputClass}
        />
      </div>

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
          placeholder="Mínimo de 6 caracteres"
          autoComplete="new-password"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-semibold text-slate-700"
        >
          Confirmar senha
        </label>
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Repita sua senha"
          autoComplete="new-password"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Criando..." : "Criar conta"}
      </button>

      <p className="text-center text-sm font-medium text-slate-500">
        Já tem uma conta?{" "}
        <Link to="/login" className="font-semibold text-indigo-600">
          Entrar
        </Link>
      </p>
    </form>
  );
}
