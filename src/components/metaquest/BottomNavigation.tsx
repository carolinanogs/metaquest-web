import { Link, useRouterState } from "@tanstack/react-router";
import { Home, ListChecks, Plus, Trophy, User } from "lucide-react";

type NavItem = { to: string; label: string; icon: typeof Home; primary?: boolean };
const items: NavItem[] = [
  { to: "/dashboard", label: "Início", icon: Home },
  { to: "/goals", label: "Metas", icon: ListChecks },
  { to: "/add-goal", label: "Adicionar", icon: Plus, primary: true },
  { to: "/gamification", label: "Conquistas", icon: Trophy },
  { to: "/profile", label: "Perfil", icon: User },
];

export function BottomNavigation() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-md items-end justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {items.map(({ to, label, icon: Icon, primary }) => {
          const active = pathname === to;
          if (primary) {
            return (
              <Link
                key={to}
                to={to as never}
                className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 transition-transform active:scale-95"
                aria-label={label}
              >
                <Icon className="h-6 w-6" />
              </Link>
            );
          }
          return (
            <Link
              key={to}
              to={to as never}
              className={`flex min-w-[56px] flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[11px] font-medium transition-colors ${
                active ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "scale-110" : ""} transition-transform`} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
