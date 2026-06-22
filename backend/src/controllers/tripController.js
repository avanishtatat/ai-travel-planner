const Trip = require("../models/Trip.js");
const {
  generateTripPlan,
  regenerateDayPlan,
} = require("../services/aiServices.js");
const asyncHandler = require("../utils/asyncHandler.js");

const generateTrip = asyncHandler(async (req, res) => {
  const {
    destination,
    numberOfDays,
    budgetType,
    interests,
    startDate,
    travelersCount,
    travelStyle,
  } = req.body;

  const generatedTrip = await generateTripPlan({
    destination,
    numberOfDays,
    budgetType,
    interests,
    startDate,
    travelersCount,
    travelStyle,
  });

  if (!generatedTrip) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate trip plan" });
  }

  const newTrip = await Trip.create({
    userId: req.user._id,
    destination,
    numberOfDays,
    budgetType,
    interests,
    startDate,
    travelersCount,
    travelStyle,
    ...generatedTrip,
  });

  return res.status(201).json({ success: true, trip: newTrip });
});

const getTrips = asyncHandler(async (req, res) => {
  const trips = await Trip.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  if (!trips || trips.length === 0) {
    return res.status(200).json({ success: true, trips: [] });
  }
  return res.status(200).json({ success: true, trips });
});

const getTripById = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
  if (!trip) {
    return res.status(404).json({ success: false, message: "Trip not found" });
  }
  return res.status(200).json({ success: true, trip });
});

const addActivity = asyncHandler(async (req, res) => {
  const { dayNumber, activity } = req.body;
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
  if (!trip) {
    return res.status(404).json({ success: false, message: "Trip not found" });
  }

  if (dayNumber < 1 || dayNumber > trip.numberOfDays) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid day number" });
  }

  const day = trip.itinerary.find(
    (item) => item.dayNumber === Number(dayNumber),
  );
  if (!day) {
    return res
      .status(404)
      .json({ success: false, message: "Itinerary day not found" });
  }
  day.activities.push(activity);
  await trip.save();

  return res.status(200).json({ success: true, trip });
});

const removeActivity = asyncHandler(async (req, res) => {
  const { dayNumber, activityId } = req.body;
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });

  if (!trip) {
    return res.status(404).json({ success: false, message: "Trip not found" });
  }

  if (dayNumber < 1 || dayNumber > trip.numberOfDays) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid day number" });
  }

  const day = trip.itinerary.find(
    (item) => item.dayNumber === Number(dayNumber),
  );
  if (!day) {
    return res
      .status(404)
      .json({ success: false, message: "Itinerary day not found" });
  }

  const activityExists = day.activities.some(
    (act) => act._id.toString() === activityId,
  );
  if (!activityExists) {
    return res
      .status(404)
      .json({ success: false, message: "Activity not found" });
  }
  day.activities = day.activities.filter(
    (act) => act._id.toString() !== activityId,
  );
  await trip.save();

  return res.status(200).json({ success: true, trip });
});

const regenerateDay = asyncHandler(async (req, res) => {
  const { dayNumber, instruction } = req.body;
  const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });

  if (!trip) {
    return res.status(404).json({ success: false, message: "Trip not found" });
  }

  if (dayNumber < 1 || dayNumber > trip.numberOfDays) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid day number" });
  }

  const day = trip.itinerary.find(
    (item) => item.dayNumber === Number(dayNumber),
  );
  if (!day) {
    return res
      .status(404)
      .json({ success: false, message: "Itinerary day not found" });
  }

  const regeneratedDay = await regenerateDayPlan({
    trip,
    dayNumber,
    instruction,
  });

  if (!regeneratedDay) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to regenerate day plan" });
  }

  Object.assign(day, {
    dayNumber: Number(regeneratedDay.dayNumber),
    title: regeneratedDay.title,
    activities: regeneratedDay.activities,
  });
  await trip.save();

  return res.status(200).json({ success: true, trip });
});

const deleteTrip = asyncHandler(async (req, res) => {
  const trip = await Trip.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  if (!trip) {
    return res.status(404).json({ success: false, message: "Trip not found" });
  }
  return res
    .status(200)
    .json({ success: true, message: "Trip deleted successfully" });
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  
  const [totalTrips, upcomingTrips, visitedCountries, nextTrip] = await Promise.all([
    Trip.countDocuments({ userId: req.user._id }),
    Trip.countDocuments({ userId: req.user._id, startDate: { $gte: today } }),
    Trip.distinct("destination", { userId: req.user._id, startDate: { $lt: today } }),
    Trip.findOne({ userId: req.user._id, startDate: { $gte: today } }).sort({ startDate: 1 }).select("destination startDate numberOfDays"),
  ]);
  
  return res.status(200).json({
    success: true,
    stats: {
      totalTrips,
      upcomingTrips,
      visitedCountriesCount: visitedCountries.length,
      visitedCountries,
      nextTrip,
    },
  });
});

module.exports = {
  generateTrip,
  getTrips,
  getTripById,
  addActivity,
  removeActivity,
  regenerateDay,
  deleteTrip,
  getDashboardStats,
};
