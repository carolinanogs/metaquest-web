import { LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

export function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    if (!window.confirm("Tem certeza que deseja sair da sua conta?")) return;
    await logout();
    toast.success("Você saiu da conta.");
    navigate({ to: "/login", replace: true });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 ring-1 ring-red-100 transition hover:bg-red-100 active:scale-[0.98]"
    >
      <LogOut className="h-4 w-4" />
      Sair
    </button>
  );
}
