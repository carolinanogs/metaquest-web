import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { UserProfileCard } from "@/components/auth/UserProfileCard";
import { MobileShell } from "@/components/metaquest/MobileShell";
import { useAuth } from "@/lib/auth";
import { useMetaQuest } from "@/lib/metaquest/store";
import { CATEGORY_LABELS, type Category } from "@/lib/metaquest/types";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Perfil — MetaQuest" }] }),
  component: ProfileRoute,
});

function ProfileRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== "/profile") return <Outlet />;

  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}

function ProfilePage() {
  const { currentUser } = useAuth();
  const { user, goals } = useMetaQuest();
  const cats = (Object.entries(user.completedByCategory) as [Category, number][])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (!currentUser) return null;

  return (
    <MobileShell title="Perfil">
      <UserProfileCard authUser={currentUser} user={user} totalGoals={goals.length} />

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Top categorias</h2>
        {cats.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            Conclua metas para ver suas categorias mais usadas.
          </div>
        ) : (
          <ul className="space-y-2">
            {cats.map(([c, n]) => (
              <li key={c} className="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                <span className="font-medium text-slate-700">{CATEGORY_LABELS[c]}</span>
                <span className="text-sm font-semibold text-indigo-600">{n} concluídas</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </MobileShell>
  );
}
