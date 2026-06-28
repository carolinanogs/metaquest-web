import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { isValidEmail, normalizeEmail, useAuth } from "@/lib/auth";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
const buttonClass =
  "w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition active:scale-[0.98]";

export function EditProfileForm() {
  const { currentUser, updateCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!currentUser) return;
    setError("");

    if (!name.trim()) {
      setError("Informe seu nome.");
      return;
    }
    if (!email.trim()) {
      setError("Informe seu e-mail.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Informe um e-mail válido.");
      return;
    }

    const nextEmail = normalizeEmail(email);

    setLoading(true);
    try {
      await updateCurrentUser({ name: name.trim(), email: nextEmail });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Não foi possível atualizar o perfil.");
      setLoading(false);
      return;
    }
    setLoading(false);

    toast.success("Perfil atualizado!");
    navigate({ to: "/profile" });
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
          className={inputClass}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className={buttonClass}>
        {loading ? "Salvando..." : "Salvar alterações"}
      </button>
    </form>
  );
}
