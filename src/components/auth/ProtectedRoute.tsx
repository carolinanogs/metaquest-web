import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

function RouteLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50/40 px-4">
      <div className="rounded-2xl bg-white px-5 py-4 text-sm font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
        Carregando...
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser, hydrated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && !currentUser) {
      navigate({ to: "/login", replace: true });
    }
  }, [currentUser, hydrated, navigate]);

  if (!hydrated || !currentUser) return <RouteLoader />;

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { currentUser, hydrated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (hydrated && currentUser) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [currentUser, hydrated, navigate]);

  if (!hydrated || currentUser) return <RouteLoader />;

  return <>{children}</>;
}
