import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { PublicOnlyRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Criar conta — MetaQuest" }] }),
  component: RegisterRoute,
});

function RegisterRoute() {
  return (
    <PublicOnlyRoute>
      <AuthLayout title="Crie sua conta" subtitle="Comece sua jornada e transforme metas em conquistas.">
        <RegisterForm />
      </AuthLayout>
    </PublicOnlyRoute>
  );
}
