import { mongoose, Schema } from "mongoose";

const StaffSchema = new Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "Project Manager",
        "Site Engineer",
        "Foreman",
        "Mason",
        "Carpenter",
        "Electrician",
        "Plumber",
        "Laborer",
        "Safety Officer",
        "Quality Inspector",
        "Other",
      ],
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    workProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0, // Optional: set to 0 initially
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Staff = mongoose.model("Staff", StaffSchema);
