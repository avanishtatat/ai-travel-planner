const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    estimatedCost: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: true },
);

const itineraryDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    activities: {
      type: [activitySchema],
      default: [],
    },
  },
  { _id: true },
);

const hotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ['Budget', 'Mid Range', 'Luxury'],
            required: true,
        },
        pricePerNight: {
            type: Number,
            default: 0,
            min: 0,
        },
        rating: {
            type: String,
            default: ""
        },
        reason: {
            type: String,
            default: ""
        }
    },
    { _id: false },
);
        

const safetySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { _id: false },
);

const tripSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        destination: {
            type: String,
            required: true,
            trim: true,
        },
        numberOfDays: {
            type: Number,
            required: true,
            min: 1,
            max: 30,
        },
        budgetType: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            required: true,
        },
        interests: {
            type: [String],
            default: [],
        },
        startDate: {
            type: Date,
            required: true,
        },
        travelersCount: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        travelStyle: {
            type: String,
            enum: ['Relaxed', 'Balanced', 'Packed'],
            default: 'Balanced',
        },
        itinerary: {
            type: [itineraryDaySchema],
            default: [],
        },
        estimatedBudget: {
            flights: {
                type: Number,
                default: 0,
            },
            accommodation: {
                type: Number,
                default: 0,
            },
            food: {
                type: Number,
                default: 0,
            },
            activities: {
                type: Number,
                default: 0,
            },
            transport: {
                type: Number,
                default: 0,
            },
            total: {
                type: Number,
                default: 0,
            },
            currency: {
                type: String,
                default: "USD",
            },
        },
        hotels: {
            type: [hotelSchema],
            default: [],
        },
        safetyTips: {
            type: [safetySchema],
            default: [],
        },
        aiGeneratedAt: {
            type: Date,
        }
    },
    { timestamps: true },
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
