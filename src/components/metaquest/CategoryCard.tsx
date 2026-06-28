import { CATEGORY_COLORS, CATEGORY_LABELS, type Category } from "@/lib/metaquest/types";

export function CategoryCard({ category, total, done }: { category: Category; total: number; done: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className={`rounded-2xl border p-3 ${CATEGORY_COLORS[category]}`}>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-70">{CATEGORY_LABELS[category]}</div>
      <div className="mt-1 flex items-end justify-between">
        <div className="text-2xl font-bold">{done}/{total}</div>
        <div className="text-xs font-medium">{pct}%</div>
      </div>
    </div>
  );
}
