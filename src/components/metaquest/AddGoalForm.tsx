import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
  DIFFICULTY_XP,
  type Category,
  type Difficulty,
  type GoalType,
} from "@/lib/metaquest/types";
import { useMetaQuest } from "@/lib/metaquest/store";

export function AddGoalForm() {
  const { addGoal } = useMetaQuest();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("pessoal");
  const [type, setType] = useState<GoalType>("diaria");
  const [difficulty, setDifficulty] = useState<Difficulty>("media");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (type === "longo_prazo" && !endDate) return;
    setLoading(true);
    const created = await addGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      type,
      difficulty,
      endDate: type === "longo_prazo" ? endDate : undefined,
    });
    setLoading(false);
    if (created) navigate({ to: "/goals" });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Estudar 1 hora"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Opcional"
          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Categoria</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          {(Object.keys(CATEGORY_LABELS) as Category[]).map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Tipo</label>
        <div className="grid grid-cols-2 gap-2">
          {(["diaria", "longo_prazo"] as GoalType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                type === t
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {t === "diaria" ? "Diária" : "Longo prazo"}
            </button>
          ))}
        </div>
      </div>

      {type === "longo_prazo" && (
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">Data final</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            required
          />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-700">Dificuldade</label>
        <div className="grid grid-cols-3 gap-2">
          {(["facil", "media", "dificil"] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-all ${
                difficulty === d
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              <div>{DIFFICULTY_LABELS[d]}</div>
              <div className="text-xs font-normal opacity-70">+{DIFFICULTY_XP[d]} XP</div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Criando..." : "Criar meta"}
      </button>
    </form>
  );
}
