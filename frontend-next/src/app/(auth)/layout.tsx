export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] bg-mesh-dark dark:bg-mesh-dark">
      <div className="w-full max-w-md px-4">
        {children}
      </div>
    </div>
  )
}
