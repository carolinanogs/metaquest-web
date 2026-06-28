import { Flame } from "lucide-react";

export function StreakCard({ streak, doneToday }: { streak: number; doneToday: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <Flame className="h-6 w-6 text-orange-500" />
        <div className="mt-2 text-2xl font-bold text-orange-700">{streak}</div>
        <div className="text-xs font-medium text-orange-600/80">dias de streak</div>
      </div>
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
        <div className="text-3xl">✅</div>
        <div className="mt-1 text-2xl font-bold text-emerald-700">{doneToday}</div>
        <div className="text-xs font-medium text-emerald-600/80">concluídas hoje</div>
      </div>
    </div>
  );
}
