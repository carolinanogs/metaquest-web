import { MobileShell } from "@/components/metaquest/MobileShell";
import { AddGoalForm } from "@/components/metaquest/AddGoalForm";

export function AddGoalPage() {
  return (
    <MobileShell title="Nova meta">
      <AddGoalForm />
    </MobileShell>
  );
}
