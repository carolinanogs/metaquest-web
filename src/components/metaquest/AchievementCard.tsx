import { Lock, Trophy } from "lucide-react";
import type { Achievement } from "@/lib/metaquest/types";

export function AchievementCard({ a }: { a: Achievement }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-3 ${
        a.unlocked ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50 opacity-70"
      }`}
    >
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
          a.unlocked ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" : "bg-slate-200 text-slate-400"
        }`}
      >
        {a.unlocked ? <Trophy className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
      </div>
      <div className="min-w-0">
        <div className="truncate font-semibold text-slate-900">{a.title}</div>
        <div className="truncate text-xs text-slate-500">{a.description}</div>
      </div>
    </div>
  );
}
