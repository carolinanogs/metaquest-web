import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MobileShell } from "@/components/metaquest/MobileShell";
import { GoalCard } from "@/components/metaquest/GoalCard";
import { useMetaQuest } from "@/lib/metaquest/store";
import type { Category, GoalType } from "@/lib/metaquest/types";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Metas — MetaQuest" }] }),
  component: GoalsRoute,
});

type Filter = "todas" | GoalType | Category;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "diaria", label: "Diárias" },
  { id: "longo_prazo", label: "Longo prazo" },
  { id: "pessoal", label: "Pessoais" },
  { id: "profissional", label: "Profissionais" },
  { id: "estudos", label: "Estudos" },
  { id: "saude", label: "Saúde" },
  { id: "financas", label: "Finanças" },
  { id: "habitos", label: "Hábitos" },
  { id: "projetos", label: "Projetos" },
];

function GoalsRoute() {
  return (
    <ProtectedRoute>
      <GoalsPage />
    </ProtectedRoute>
  );
}

function GoalsPage() {
  const { goals } = useMetaQuest();
  const [filter, setFilter] = useState<Filter>("todas");

  const list = goals.filter((g) => {
    if (filter === "todas") return true;
    if (filter === "diaria" || filter === "longo_prazo") return g.type === filter;
    return g.category === filter;
  });

  return (
    <MobileShell title="Minhas metas">
      <div className="-mx-4 mb-4 overflow-x-auto px-4">
        <div className="flex gap-2 pb-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f.id
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "bg-white text-slate-600 ring-1 ring-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Nenhuma meta neste filtro.
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((g) => <GoalCard key={g.id} goal={g} />)}
        </div>
      )}
    </MobileShell>
  );
}
