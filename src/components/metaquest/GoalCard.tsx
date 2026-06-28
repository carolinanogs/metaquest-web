import { Calendar, CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";
import { CATEGORY_COLORS, CATEGORY_LABELS, type Goal } from "@/lib/metaquest/types";
import { isDailyDoneToday, useMetaQuest } from "@/lib/metaquest/store";
import { ProgressBar } from "./ProgressBar";
import { XPBadge } from "./XPBadge";
import { useState } from "react";

function formatDate(s?: string) {
  if (!s) return "";
  const d = new Date(s);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function GoalCard({ goal, onEdit }: { goal: Goal; onEdit?: (g: Goal) => void }) {
  const { toggleDaily, completeLongTerm, removeGoal, setProgress } = useMetaQuest();
  const done = goal.type === "diaria" ? isDailyDoneToday(goal) : goal.status === "concluida";
  const [editingProg, setEditingProg] = useState(false);

  const statusBadge =
    goal.status === "atrasada"
      ? "bg-red-100 text-red-700"
      : goal.status === "concluida"
        ? "bg-emerald-100 text-emerald-700"
        : goal.status === "em_andamento"
          ? "bg-blue-100 text-blue-700"
          : "bg-slate-100 text-slate-600";

  const statusLabel: Record<typeof goal.status, string> = {
    nao_iniciada: "Não iniciada",
    em_andamento: "Em andamento",
    concluida: "Concluída",
    atrasada: "Atrasada",
  } as const;

  return (
    <div
      className={`group rounded-2xl border bg-white/90 p-4 shadow-sm transition-all hover:shadow-md ${
        done ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() =>
            void (goal.type === "diaria" ? toggleDaily(goal.id) : completeLongTerm(goal.id))
          }
          className="mt-0.5 shrink-0 transition-transform active:scale-90"
          aria-label="Concluir"
          disabled={goal.type === "longo_prazo" && goal.status === "concluida"}
        >
          {done ? (
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
          ) : (
            <Circle className="h-7 w-7 text-slate-300" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`truncate text-base font-semibold ${done ? "text-slate-500 line-through" : "text-slate-900"}`}
            >
              {goal.title}
            </h3>
            <XPBadge xp={goal.xp} />
          </div>

          {goal.description && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-500">{goal.description}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[goal.category]}`}
            >
              {CATEGORY_LABELS[goal.category]}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {goal.type === "diaria" ? "Diária" : "Longo prazo"}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge}`}>
              {statusLabel[goal.status]}
            </span>
            {goal.endDate && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                <Calendar className="h-3 w-3" />
                {formatDate(goal.endDate)}
              </span>
            )}
          </div>

          {goal.type === "longo_prazo" && (
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <span>Progresso</span>
                <button
                  onClick={() => setEditingProg((v) => !v)}
                  className="font-semibold text-indigo-600"
                >
                  {goal.progress}%
                </button>
              </div>
              <ProgressBar value={goal.progress} />
              {editingProg && (
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={goal.progress}
                  onChange={(e) => void setProgress(goal.id, Number(e.target.value))}
                  className="mt-2 w-full accent-indigo-500"
                />
              )}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(goal)}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
              >
                <Pencil className="h-3 w-3" /> Editar
              </button>
            )}
            <button
              onClick={() => void removeGoal(goal.id)}
              className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
            >
              <Trash2 className="h-3 w-3" /> Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
