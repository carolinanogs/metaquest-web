import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AddGoalPage } from "@/pages/AddGoalPage";

export const Route = createFileRoute("/add-goal")({
  head: () => ({ meta: [{ title: "Nova meta — MetaQuest" }] }),
  component: AddGoalRoute,
});

function AddGoalRoute() {
  return (
    <ProtectedRoute>
      <AddGoalPage />
    </ProtectedRoute>
  );
}
