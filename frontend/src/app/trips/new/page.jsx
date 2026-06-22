"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, X } from "lucide-react";

import ProtectedRoute from "@/components/shared/ProtectedRoute";
import AppNavbar from "@/components/layout/AppNavbar";
import { generateTrip } from "@/services/tripService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const defaultInterests = [
  "Food",
  "Culture",
  "Adventure",
  "Shopping",
  "Nature",
  "History",
];

export default function NewTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [interestInput, setInterestInput] = useState("");

  const [formData, setFormData] = useState({
    destination: "",
    numberOfDays: "",
    budgetType: "Medium",
    interests: [],
    startDate: "",
    travelersCount: "1",
    travelStyle: "Balanced",
  });

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addInterest = (interest) => {
    const value = interest.trim();
    if (!value || formData.interests.includes(value)) return;

    setFormData((prev) => ({
      ...prev,
      interests: [...prev.interests, value],
    }));
    setInterestInput("");
  };

  const removeInterest = (interest) => {
    console.log("Removing interest:", interest);
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((item) => item !== interest),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.destination ||
      !formData.numberOfDays ||
      !formData.startDate
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.interests.length === 0) {
      toast.error("Add at least one interest");
      return;
    }

    try {
      setLoading(true);

      const response = await generateTrip({
        ...formData,
        numberOfDays: Number(formData.numberOfDays),
        travelersCount: Number(formData.travelersCount),
      });

      toast.success("Trip generated successfully");
      router.push(`/trips/${response.data.trip._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to generate trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f7f7ff]">
        <AppNavbar />

        <main className="mx-auto max-w-4xl px-6 py-10">
          <div className="mb-8">
            <p className="text-sm font-medium text-indigo-600">
              AI Trip Builder
            </p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">
              Plan a new journey
            </h1>
            <p className="mt-2 text-slate-600">
              Tell VoyageMind your travel preferences and let AI create your
              itinerary.
            </p>
          </div>

          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Destination</Label>
                    <Input
                      placeholder="Tokyo, Japan"
                      value={formData.destination}
                      onChange={(e) =>
                        updateField("destination", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Number of Days</Label>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      placeholder="5"
                      value={formData.numberOfDays}
                      onChange={(e) =>
                        updateField("numberOfDays", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => updateField("startDate", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Travelers</Label>
                    <Input
                      type="number"
                      min="1"
                      value={formData.travelersCount}
                      onChange={(e) =>
                        updateField("travelersCount", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Budget Type</Label>
                    <Select
                      value={formData.budgetType}
                      onValueChange={(value) =>
                        updateField("budgetType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Travel Style</Label>
                    <Select
                      value={formData.travelStyle}
                      onValueChange={(value) =>
                        updateField("travelStyle", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Relaxed">Relaxed</SelectItem>
                        <SelectItem value="Balanced">Balanced</SelectItem>
                        <SelectItem value="Packed">Packed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Interests</Label>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom interest"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addInterest(interestInput);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addInterest(interestInput)}
                    >
                      Add
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {defaultInterests.map((interest) => (
                      <Button
                        key={interest}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addInterest(interest)}
                      >
                        {interest}
                      </Button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest) => (
                      <Badge
                        key={interest}
                        className="gap-2 bg-indigo-100 text-indigo-700"
                      >
                        {interest}
                        <span onClick={() => removeInterest(interest)}>
                          <X className="h-3 w-3 cursor-pointer" />
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  {loading ? "Generating AI Trip..." : "Generate AI Trip"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </ProtectedRoute>
  );
}
