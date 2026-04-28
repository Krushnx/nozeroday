import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // store time in minutes (e.g. 7:30 AM = 450)
    startMinutes: {
      type: Number,
      required: true,
      min: 0,
      max: 1440,
    },

    endMinutes: {
      type: Number,
      required: true,
      min: 0,
      max: 1440,
      validate: {
        validator: function (value) {
          return value > this.startMinutes;
        },
        message: "End time must be greater than start time",
      },
    },

    requiresInput: {
      type: Boolean,
      default: false,
    },

    inputLabel: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// prevent model overwrite in dev (Next.js hot reload issue)
export default mongoose.models.Task || mongoose.model("Task", TaskSchema);