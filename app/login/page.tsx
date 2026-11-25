import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--border-hairline) 0px, transparent 1px, transparent 48px)," +
            "repeating-linear-gradient(90deg, var(--border-hairline) 0px, transparent 1px, transparent 48px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-hairline bg-surface text-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 5v6c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V5l-8-3z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </div>
          <div>
            <p className="font-mono text-sm tracking-tight text-foreground">SentinelGate</p>
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Système actif
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border-hairline bg-surface p-6">
          <h1 className="mb-1 text-lg font-medium text-foreground">Connexion administrateur</h1>
          <p className="mb-6 text-sm text-muted">Accédez au tableau de bord de supervision.</p>
          <AuthForm mode="login" />
        </div>
      </div>
    </main>
  );
}