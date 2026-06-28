import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AddGoalPage } from "@/pages/AddGoalPage";

export const Route = createFileRoute("/add")({
  head: () => ({ meta: [{ title: "Nova meta — MetaQuest" }] }),
  component: AddPage,
});

function AddPage() {
  return (
    <ProtectedRoute>
      <AddGoalPage />
    </ProtectedRoute>
  );
}
