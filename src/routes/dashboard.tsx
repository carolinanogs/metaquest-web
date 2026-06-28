import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Dashboard } from "@/pages/Dashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — MetaQuest" },
      { name: "description", content: "Acompanhe metas pessoais e profissionais e suba de nível." },
    ],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
