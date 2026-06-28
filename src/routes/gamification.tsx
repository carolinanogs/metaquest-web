import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MobileShell } from "@/components/metaquest/MobileShell";
import { LevelCard } from "@/components/metaquest/LevelCard";
import { AchievementCard } from "@/components/metaquest/AchievementCard";
import { useMetaQuest } from "@/lib/metaquest/store";

export const Route = createFileRoute("/gamification")({
  head: () => ({ meta: [{ title: "Conquistas — MetaQuest" }] }),
  component: GamificationRoute,
});

function GamificationRoute() {
  return (
    <ProtectedRoute>
      <GamificationPage />
    </ProtectedRoute>
  );
}

function GamificationPage() {
  const { user, goals } = useMetaQuest();
  const completed = goals.filter((g) => g.status === "concluida");
  const unlockedCount = user.achievements.filter((a) => a.unlocked).length;

  const tier =
    user.level >= 10 ? "Lendário"
    : user.level >= 6 ? "Mestre"
    : user.level >= 3 ? "Aventureiro"
    : "Iniciante";

  return (
    <MobileShell title="Conquistas">
      <LevelCard xp={user.xp} name={user.name} />

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
          <div className="text-2xl font-bold text-slate-900">{unlockedCount}</div>
          <div className="text-xs text-slate-500">Conquistas</div>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
          <div className="text-2xl font-bold text-slate-900">{user.totalCompleted}</div>
          <div className="text-xs text-slate-500">Metas feitas</div>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
          <div className="text-sm font-bold text-indigo-600">{tier}</div>
          <div className="text-xs text-slate-500">Status</div>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Medalhas</h2>
        <div className="space-y-2">
          {user.achievements.map((a) => <AchievementCard key={a.id} a={a} />)}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Histórico</h2>
        {completed.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            Conclua sua primeira meta para começar o histórico.
          </div>
        ) : (
          <ul className="space-y-2">
            {completed.map((g) => (
              <li key={g.id} className="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">{g.title}</div>
                  <div className="text-xs text-slate-500">+{g.xp} XP</div>
                </div>
                <span className="text-xs text-emerald-600">✓ Concluída</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </MobileShell>
  );
}
