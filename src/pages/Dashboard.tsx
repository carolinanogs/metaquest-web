import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { MobileShell } from "@/components/metaquest/MobileShell";
import { LevelCard } from "@/components/metaquest/LevelCard";
import { StreakCard } from "@/components/metaquest/StreakCard";
import { CategoryCard } from "@/components/metaquest/CategoryCard";
import { GoalCard } from "@/components/metaquest/GoalCard";
import { isDailyDoneToday, useMetaQuest } from "@/lib/metaquest/store";
import { CATEGORY_LABELS, type Category } from "@/lib/metaquest/types";

export function Dashboard() {
  const { user, goals } = useMetaQuest();
  const dailies = goals.filter((g) => g.type === "diaria");
  const doneToday = dailies.filter(isDailyDoneToday).length;

  const cats = (Object.keys(CATEGORY_LABELS) as Category[])
    .map((c) => {
      const list = goals.filter((g) => g.category === c);
      const done = list.filter((g) => g.status === "concluida" || isDailyDoneToday(g)).length;
      return { c, total: list.length, done };
    })
    .filter((x) => x.total > 0);

  return (
    <MobileShell>
      <LevelCard xp={user.xp} name={user.name} />

      <div className="mt-4">
        <StreakCard streak={user.streak} doneToday={doneToday} />
      </div>

      {cats.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Por categoria</h2>
          <div className="grid grid-cols-2 gap-2">
            {cats.map((x) => (
              <CategoryCard key={x.c} category={x.c} total={x.total} done={x.done} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Metas de hoje</h2>
          <Link to="/add-goal" className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
            <Plus className="h-4 w-4" /> Nova
          </Link>
        </div>
        {dailies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            Nenhuma meta diária ainda. Crie uma!
          </div>
        ) : (
          <div className="space-y-3">
            {dailies.map((g) => (
              <GoalCard key={g.id} goal={g} />
            ))}
          </div>
        )}
      </section>
    </MobileShell>
  );
}
