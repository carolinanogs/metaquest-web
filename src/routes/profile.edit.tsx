import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { EditProfileForm } from "@/components/auth/EditProfileForm";
import { MobileShell } from "@/components/metaquest/MobileShell";

export const Route = createFileRoute("/profile/edit")({
  head: () => ({ meta: [{ title: "Editar perfil — MetaQuest" }] }),
  component: EditProfileRoute,
});

function EditProfileRoute() {
  return (
    <ProtectedRoute>
      <MobileShell title="Editar perfil">
        <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200">
          <EditProfileForm />
        </div>
      </MobileShell>
    </ProtectedRoute>
  );
}
