import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { PublicOnlyRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — MetaQuest" }] }),
  component: LoginRoute,
});

function LoginRoute() {
  return (
    <PublicOnlyRoute>
      <AuthLayout title="Bem-vindo de volta" subtitle="Entre para continuar evoluindo suas metas.">
        <LoginForm />
      </AuthLayout>
    </PublicOnlyRoute>
  );
}
