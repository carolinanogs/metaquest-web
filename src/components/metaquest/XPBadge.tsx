import { Sparkles } from "lucide-react";

export function XPBadge({ xp }: { xp: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
      <Sparkles className="h-3 w-3" />
      {xp} XP
    </span>
  );
}
