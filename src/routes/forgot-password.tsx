import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { PublicOnlyRoute } from "@/components/auth/ProtectedRoute";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Recuperar senha — MetaQuest" }] }),
  component: ForgotPasswordRoute,
});

function ForgotPasswordRoute() {
  return (
    <PublicOnlyRoute>
      <AuthLayout title="Recuperar senha" subtitle="Informe seu e-mail para simular a recuperação de acesso.">
        <ForgotPasswordForm />
      </AuthLayout>
    </PublicOnlyRoute>
  );
}
