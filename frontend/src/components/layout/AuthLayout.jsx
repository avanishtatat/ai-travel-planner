export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">VoyageMind</h1>

          <h2 className="mt-4 text-xl font-semibold">{title}</h2>

          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>

        {children}
      </div>
    </main>
  );
}
