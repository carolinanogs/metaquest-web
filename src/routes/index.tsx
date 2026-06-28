import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MetaQuest — Suas metas com gamificação" },
      { name: "description", content: "Acompanhe metas pessoais e profissionais e suba de nível conforme conquista cada objetivo." },
    ],
  }),
  component: HomeRedirect,
});

function HomeRedirect() {
  const { currentUser, hydrated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    navigate({ to: currentUser ? "/dashboard" : "/login", replace: true });
  }, [currentUser, hydrated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50/40 px-4">
      <div className="rounded-2xl bg-white px-5 py-4 text-sm font-medium text-slate-500 shadow-sm ring-1 ring-slate-200">
        Carregando...
      </div>
    </div>
  );
}
