"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Compass,
  Globe2,
  Map,
  Plane,
  Plus,
  Clock3,
  MapPin,
} from "lucide-react";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import AppNavbar from "@/components/layout/AppNavbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardStats } from "@/services/tripService";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.stats);
        setRecentTrips(res.data.stats.recentTrips || []);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f7f7ff]">
        <AppNavbar />

        <main className="mx-auto max-w-7xl px-6 py-8">
          <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-white via-indigo-50 to-sky-100 p-8 shadow-sm md:p-12">
            <div className="max-w-xl">
              <p className="mb-3 text-sm font-medium text-slate-500">
                Your AI-curated travel command center
              </p>

              <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-6xl">
                Your next{" "}
                <span className="text-indigo-600">unforgettable journey</span>{" "}
                starts here.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
                Generate AI-powered travel itineraries, estimate budgets,
                discover recommended hotels, and organize every trip
                effortlessly from one beautiful workspace.
              </p>

              <Button
                size="lg"
                className="mt-7 bg-indigo-600 hover:bg-indigo-700"
                asChild
              >
                <Link href="/trips/new">
                  <Plus className="mr-2 h-5 w-5" />
                  Plan New Trip
                </Link>
              </Button>
            </div>

            <div className="absolute right-10 top-10 hidden h-64 w-64 rounded-full bg-indigo-300/30 blur-3xl md:block" />
            <Plane className="absolute right-20 top-24 hidden h-24 w-24 rotate-12 text-indigo-300 md:block" />
          </section>

          {loading ? (
            <p className="mt-8 text-slate-500">Loading dashboard...</p>
          ) : (
            <>
              <section className="mt-[2rem] grid gap-5 md:grid-cols-4">
                <StatCard
                  icon={<Map />}
                  title="Total Trips"
                  value={stats?.totalTrips || 0}
                />
                <StatCard
                  icon={<CalendarDays />}
                  title="Upcoming Trips"
                  value={stats?.upcomingTrips || 0}
                />
                <StatCard
                  icon={<Globe2 />}
                  title="Places Visited"
                  value={stats?.visitedCountriesCount || 0}
                />

                <Card className="border-0 bg-indigo-600 text-white shadow-xl">
                  <CardContent className="p-6">
                    <Plane className="mb-5 h-6 w-6 opacity-90" />
                    <p className="text-xs font-semibold uppercase text-indigo-100">
                      Next Trip
                    </p>
                    <p className="mt-2 text-3xl font-black">
                      {stats?.nextTrip
                        ? `${stats.nextTrip.numberOfDays} Days`
                        : "No Trip"}
                    </p>
                    {stats?.nextTrip && (
                      <p className="mt-2 text-sm text-indigo-100">
                        {stats.nextTrip.destination}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </section>

              <section className="mt-10">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-950">
                    Recent Trips
                  </h2>

                  <Link
                    href="/trips"
                    className="text-sm font-medium text-indigo-600"
                  >
                    View All →
                  </Link>
                </div>

                {recentTrips.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="flex flex-col items-center py-16 text-center">
                      <Compass className="mb-4 h-12 w-12 text-indigo-400" />
                      <h3 className="text-xl font-bold">
                        Your journey starts here
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        Create your first AI-powered itinerary.
                      </p>
                      <Button className="mt-5 bg-indigo-600" asChild>
                        <Link href="/trips/new">Create Trip</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-3">
                    {recentTrips.map((trip) => (
                      <TripCard key={trip._id} trip={trip} />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <Card className="border-0 bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          {icon}
        </div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
      </CardContent>
    </Card>
  );
}

function TripCard({ trip }) {
  const gradients = [
    "from-violet-500 via-fuchsia-500 to-pink-500",
    "from-sky-500 via-cyan-500 to-emerald-500",
    "from-orange-500 via-amber-400 to-yellow-300",
    "from-indigo-500 via-blue-500 to-cyan-400",
  ];

  const gradient = gradients[trip.destination.length % gradients.length];

  return (
    <Card className="group overflow-hidden rounded-3xl border-0 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      <div
        className={`relative h-40 overflow-hidden bg-gradient-to-br ${gradient}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_50%)]" />

        <Plane className="absolute right-5 top-5 h-8 w-8 rotate-12 text-white/80" />

        <div className="absolute bottom-5 left-5">
          <div className="mb-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            AI Planned
          </div>

          <h3 className="text-2xl font-bold text-white">{trip.destination}</h3>
        </div>
      </div>

      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
            {trip.budgetType}
          </Badge>

          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            {trip.travelStyle}
          </Badge>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-indigo-500" />
            {new Date(trip.startDate).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-indigo-500" />
            {trip.numberOfDays} Days
          </div>

          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-indigo-500" />
            {trip.travelStyle} Journey
          </div>
        </div>

        <Button
          asChild
          className="h-11 w-full rounded-xl bg-slate-900 transition group-hover:bg-indigo-600"
        >
          <Link
            href={`/trips/${trip._id}`}
            className="flex items-center justify-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
