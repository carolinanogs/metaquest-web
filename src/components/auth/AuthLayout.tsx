import type { ReactNode } from "react";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/40 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-indigo-500/25">
            M
          </div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">MetaQuest</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-lg shadow-indigo-100/60 ring-1 ring-slate-200">
          {children}
        </div>
      </div>
    </main>
  );
}
