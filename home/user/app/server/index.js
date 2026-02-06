const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/requirements";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schema
const requirementSchema = new mongoose.Schema(
  {
    // Step 1: Event basics
    eventName: { type: String, required: true },
    eventType: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    location: { type: String, required: true },
    venue: { type: String },

    // Step 2: Hire type
    hireType: {
      type: String,
      enum: ["planner", "performer", "crew"],
      required: true,
    },

    // Step 3: Type-specific details
    // Planner fields
    plannerBudget: String,
    plannerServices: [String],
    plannerGuestCount: String,
    plannerNotes: String,

    // Performer fields
    performerGenre: String,
    performerType: String,
    performerDuration: String,
    performerEquipment: String,
    performerNotes: String,

    // Crew fields
    crewRoles: [String],
    crewCount: String,
    crewExperience: String,
    crewShiftDetails: String,
    crewNotes: String,

    // Step 4: Contact
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: String,
    additionalNotes: String,

    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Requirement = mongoose.model("Requirement", requirementSchema);

// Routes
app.post("/api/requirements", async (req, res) => {
  try {
    const requirement = new Requirement(req.body);
    await requirement.save();
    res.status(201).json({ success: true, data: requirement });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.get("/api/requirements", async (req, res) => {
  try {
    const filter = {};
    if (req.query.hireType) filter.hireType = req.query.hireType;
    const requirements = await Requirement.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: requirements });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/requirements/:id", async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement)
      return res.status(404).json({ success: false, error: "Not found" });
    res.json({ success: true, data: requirement });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
