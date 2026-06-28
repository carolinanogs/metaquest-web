import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { PasswordInput } from "./PasswordInput";

const buttonClass =
  "w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition active:scale-[0.98]";

export function ChangePasswordForm() {
  const { currentUser, changePassword } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!currentUser) return;
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("A confirmação precisa ser igual à nova senha.");
      return;
    }

    const result = await changePassword({ currentPassword, newPassword, confirmPassword });
    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(result.message);
    toast.success("Senha alterada com sucesso!");
    setTimeout(() => navigate({ to: "/profile" }), 650);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label
          htmlFor="currentPassword"
          className="mb-1 block text-sm font-semibold text-slate-700"
        >
          Senha atual
        </label>
        <PasswordInput
          id="currentPassword"
          value={currentPassword}
          onChange={setCurrentPassword}
          autoComplete="current-password"
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="mb-1 block text-sm font-semibold text-slate-700">
          Nova senha
        </label>
        <PasswordInput
          id="newPassword"
          value={newPassword}
          onChange={setNewPassword}
          autoComplete="new-password"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-semibold text-slate-700"
        >
          Confirmar nova senha
        </label>
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      <button type="submit" className={buttonClass}>
        Alterar senha
      </button>
    </form>
  );
}
