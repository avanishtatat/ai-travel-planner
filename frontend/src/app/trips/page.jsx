"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock3, Compass, MapPin, Plane, Plus } from "lucide-react";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import AppNavbar from "@/components/layout/AppNavbar";
import { getTrips } from "@/services/tripService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await getTrips();
        setTrips(res.data.trips || []);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f7f7ff]">
        <AppNavbar />

        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-indigo-600">Trip Library</p>
              <h1 className="mt-2 text-4xl font-black text-slate-950">
                Your travel plans
              </h1>
              <p className="mt-2 text-slate-600">
                View and manage every AI-generated itinerary.
              </p>
            </div>

            <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700" asChild>
              <Link href="/trips/new">
                <Plus className="mr-2 h-4 w-4" />
                Plan New Trip
              </Link>
            </Button>
          </div>

          {loading ? (
            <p className="text-slate-500">Loading trips...</p>
          ) : trips.length === 0 ? (
            <Card className="rounded-3xl border-0 bg-white shadow-sm">
              <CardContent className="flex flex-col items-center py-20 text-center">
                <Plane className="mb-4 h-14 w-14 text-indigo-400" />
                <h2 className="text-2xl font-bold">No trips planned yet</h2>
                <p className="mt-2 text-slate-500">
                  Generate your first AI-powered travel plan.
                </p>
                <Button className="mt-6 bg-indigo-600" asChild>
                  <Link href="/trips/new">Create Trip</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
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
      <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${gradient}`}>
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

        <Button asChild className="h-11 w-full rounded-xl bg-slate-900 transition group-hover:bg-indigo-600">
          <Link href={`/trips/${trip._id}`} className="flex items-center justify-center gap-2">
            <MapPin className="h-4 w-4" />
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}