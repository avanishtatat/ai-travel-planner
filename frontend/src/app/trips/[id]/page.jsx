"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarDays,
  Hotel,
  IndianRupee,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import AppNavbar from "@/components/layout/AppNavbar";
import {
  addActivity,
  deleteTrip,
  getTrip,
  regenerateDay,
  removeActivity,
} from "@/services/tripService";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TripDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(null);
  const [activityTitle, setActivityTitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const [regeneratingDay, setRegeneratingDay] = useState(null);
  const [addingActivityDay, setAddingActivityDay] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTrip = async () => {
    try {
      const res = await getTrip(id);
      setTrip(res.data.trip);
    } catch {
      toast.error("Failed to load trip");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const handleAddActivity = async (dayNumber) => {
    if (!activityTitle.trim()) return toast.error("Activity title is required");

    try {
      setAddingActivityDay(dayNumber);
      const res = await addActivity(id, {
        dayNumber,
        activity: {
          time: "Flexible",
          title: activityTitle,
          description: "Added manually by traveler",
          location: "",
          category: "Custom",
          estimatedCost: 0,
        },
      });

      setTrip(res.data.trip);
      setActivityTitle("");
      toast.success("Activity added");
    } catch {
      toast.error("Failed to add activity");
    } finally {
      setAddingActivityDay(null);
    }
  };

  const handleRemoveActivity = async (dayNumber, activityId) => {
    try {
      const res = await removeActivity(id, { dayNumber, activityId });
      setTrip(res.data.trip);
      toast.success("Activity removed");
    } catch {
      toast.error("Failed to remove activity");
    }
  };

  const handleRegenerateDay = async (dayNumber) => {
    if (!instruction.trim()) return toast.error("Enter instruction first");

    try {
      setRegeneratingDay(dayNumber);
      const res = await regenerateDay(id, { dayNumber, instruction });
      setTrip(res.data.trip);
      setInstruction("");
      toast.success(`Day ${dayNumber} regenerated`);
    } catch {
      toast.error("Failed to regenerate day");
    } finally {
      setRegeneratingDay(null);
    }
  };

  const handleDeleteTrip = async () => {
    try {
      setDeleting(true);
      await deleteTrip(id);
      toast.success("Trip deleted");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to delete trip");
    } finally {
        setDeleting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AppNavbar />
        <p className="p-8 text-slate-500">Loading trip...</p>
      </ProtectedRoute>
    );
  }

  if (!trip) return null;

  const budget = trip.estimatedBudget || {};

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f7f7ff]">
        <AppNavbar />

        <main className="mx-auto max-w-7xl px-6 py-8">
          <section className="rounded-[2rem] bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 text-white shadow-xl">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/20">
              AI Generated Trip
            </Badge>

            <h1 className="text-4xl font-black md:text-5xl">
              {trip.destination}
            </h1>

            <p className="mt-4 flex flex-wrap gap-4 text-sm text-indigo-50">
              <span>{trip.numberOfDays} Days</span>
              <span>{trip.budgetType} Budget</span>
              <span>{trip.travelStyle} Style</span>
              <span>{trip.travelersCount} Travelers</span>
              <span>{new Date(trip.startDate).toLocaleDateString()}</span>
            </p>

            <div className="mt-6 flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="mt-6 rounded-xl text-white/80 hover:bg-white/10 hover:text-red-200"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Trip
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this trip?</AlertDialogTitle>

                    <AlertDialogDescription>
                      This action cannot be undone. The itinerary, hotels,
                      budget estimates, and all generated plans will be
                      permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      onClick={handleDeleteTrip}
                      disabled={deleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      { deleting ? "Deleting..." : "Delete Trip" }
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-indigo-600" />
                  Estimated Budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <BudgetRow label="Flights" value={budget.flights} />
                <BudgetRow label="Accommodation" value={budget.accommodation} />
                <BudgetRow label="Food" value={budget.food} />
                <BudgetRow label="Transport" value={budget.transport} />
                <BudgetRow label="Activities" value={budget.activities} />
                <div className="border-t pt-3 text-lg font-bold">
                  Total: {budget.currency || "USD"} {budget.total || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5 text-indigo-600" />
                  Recommended Hotels
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {trip.hotels?.map((hotel, index) => (
                  <div key={index} className="rounded-2xl bg-slate-50 p-4">
                    <Badge>{hotel.category}</Badge>
                    <h3 className="mt-3 font-bold">{hotel.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {hotel.rating}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {hotel.reason}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <Card className="mt-8 rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Safety & Local Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {trip.safetyTips?.map((tip, index) => (
                <div key={index} className="rounded-2xl bg-emerald-50 p-4">
                  <h3 className="font-semibold text-emerald-900">
                    {tip.title}
                  </h3>
                  <p className="mt-1 text-sm text-emerald-700">
                    {tip.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <section className="mt-10 space-y-6">
            <h2 className="text-3xl font-black text-slate-950">
              Day-by-day Itinerary
            </h2>

            {trip.itinerary?.map((day) => (
              <Card key={day._id} className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-indigo-600" />
                    Day {day.dayNumber}: {day.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {day.activities.map((activity) => (
                    <div
                      key={activity._id}
                      className="flex justify-between gap-4 rounded-2xl bg-slate-50 p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-indigo-600">
                          {activity.time}
                        </p>
                        <h3 className="font-bold">{activity.title}</h3>
                        <p className="text-sm text-slate-600">
                          {activity.description}
                        </p>
                        {activity.location && (
                          <p className="mt-1 text-xs text-slate-500">
                            📍 {activity.location}
                          </p>
                        )}
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          handleRemoveActivity(day.dayNumber, activity._id)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add activity title"
                        value={activeDay === day.dayNumber ? activityTitle : ""}
                        onChange={(e) => {
                          setActiveDay(day.dayNumber);
                          setActivityTitle(e.target.value);
                        }}
                      />
                      <Button
                        onClick={() => handleAddActivity(day.dayNumber)}
                        disabled={addingActivityDay === day.dayNumber}
                      >
                        {addingActivityDay === day.dayNumber ? (
                          <RefreshCcw className={`h-4 w-4 animate-spin`} />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Textarea
                        placeholder="Regenerate this day, e.g. make it more outdoor focused"
                        value={activeDay === day.dayNumber ? instruction : ""}
                        onChange={(e) => {
                          setActiveDay(day.dayNumber);
                          setInstruction(e.target.value);
                        }}
                      />
                      <Button
                        variant="outline"
                        disabled={regeneratingDay === day.dayNumber}
                        onClick={() => handleRegenerateDay(day.dayNumber)}
                      >
                        <RefreshCcw
                          className={`mr-2 h-4 w-4 ${regeneratingDay === day.dayNumber ? "animate-spin" : ""}`}
                        />
                        {regeneratingDay === day.dayNumber
                          ? "Regenerating..."
                          : "Regenerate Day"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function BudgetRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold">{value || 0}</span>
    </div>
  );
}
