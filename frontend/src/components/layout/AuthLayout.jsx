import { Plane } from "lucide-react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-[#f7f7ff] px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-2">
        <section className="hidden lg:block">
          <div className="rounded-[2rem] bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 p-10 text-white shadow-2xl">
            <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Plane className="h-7 w-7" />
            </div>

            <h1 className="text-5xl font-black leading-tight">
              Plan smarter.
              <br />
              Travel better.
            </h1>

            <p className="mt-6 max-w-md text-indigo-50">
              Generate AI-powered itineraries, estimate budgets, discover
              hotels, and manage every trip from one beautiful workspace.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <p className="text-2xl font-black">AI</p>
                <p className="text-indigo-100">Itinerary</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <p className="text-2xl font-black">$</p>
                <p className="text-indigo-100">Budget</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <p className="text-2xl font-black">🏨</p>
                <p className="text-indigo-100">Hotels</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 lg:mx-0">
              <Plane className="h-6 w-6" />
            </div>

            <h2 className="text-3xl font-black text-slate-950">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
