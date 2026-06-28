import { Sparkles } from "lucide-react";
import { levelProgress } from "@/lib/metaquest/leveling";
import { ProgressBar } from "./ProgressBar";

export function LevelCard({ xp, name }: { xp: number; name?: string }) {
  const lp = levelProgress(xp);
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-5 text-white shadow-lg shadow-indigo-500/20">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/70">{name ? `Olá, ${name}` : "Seu progresso"}</p>
            <h2 className="mt-0.5 text-3xl font-bold">Nível {lp.level}</h2>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">
            <Sparkles className="h-4 w-4" /> {xp} XP
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-white/80">
            <span>{lp.into} / {lp.span} XP</span>
            <span>Próx. nível {lp.level + 1}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-yellow-200 transition-all duration-700"
              style={{ width: `${lp.pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { ProgressBar };
