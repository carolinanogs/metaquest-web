import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { MobileShell } from "@/components/metaquest/MobileShell";

export const Route = createFileRoute("/profile/change-password")({
  head: () => ({ meta: [{ title: "Alterar senha — MetaQuest" }] }),
  component: ChangePasswordRoute,
});

function ChangePasswordRoute() {
  return (
    <ProtectedRoute>
      <MobileShell title="Alterar senha">
        <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <ChangePasswordForm />
        </div>
      </MobileShell>
    </ProtectedRoute>
  );
}
