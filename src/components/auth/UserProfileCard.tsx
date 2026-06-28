import { Link } from "@tanstack/react-router";
import { KeyRound, Pencil } from "lucide-react";
import type { AuthUser } from "@/types/user";
import type { UserState } from "@/lib/metaquest/types";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

export function UserProfileCard({
  authUser,
  user,
  totalGoals,
}: {
  authUser: AuthUser;
  user: UserState;
  totalGoals: number;
}) {
  return (
    <>
      <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white">
            {(authUser.name?.[0] ?? "?").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-xl font-bold text-slate-900">{authUser.name}</h2>
            <p className="truncate text-sm text-slate-500">{authUser.email}</p>
            <div className="mt-1 text-sm font-semibold text-indigo-600">
              Nível {user.level} · {user.xp} XP
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            to="/profile/edit"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            <Pencil className="h-4 w-4" />
            Editar perfil
          </Link>
          <Link
            to="/profile/change-password"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            <KeyRound className="h-4 w-4" />
            Alterar senha
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Stat label="XP total" value={user.xp} />
        <Stat label="Nível atual" value={user.level} />
        <Stat label="Metas concluídas" value={user.totalCompleted} />
        <Stat label="Metas cadastradas" value={totalGoals} />
        <Stat label="Streak atual" value={`${user.streak} dias`} />
        <Stat label="Melhor streak" value={`${user.bestStreak} dias`} />
      </div>
    </>
  );
}
