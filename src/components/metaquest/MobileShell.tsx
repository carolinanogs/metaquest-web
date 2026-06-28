import type { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";

export function MobileShell({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/40">
      <div className="mx-auto max-w-md px-4 pb-28 pt-6">
        {title && <h1 className="mb-4 text-2xl font-bold text-slate-900">{title}</h1>}
        {children}
      </div>
      <BottomNavigation />
    </div>
  );
}
