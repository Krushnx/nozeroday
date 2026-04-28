import mongoose from "mongoose";

const TaskLogSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    // store date as YYYY-MM-DD (string for easy querying)
    date: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "NOT_STARTED",
        "STARTED",
        "COMPLETED",
        "PARTIAL",
        "SKIPPED",
      ],
      default: "NOT_STARTED",
    },

    inputValue: {
      type: String, // can store number or text
      default: "",
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ensure one log per task per day
TaskLogSchema.index({ taskId: 1, date: 1 }, { unique: true });

export default mongoose.models.TaskLog ||
  mongoose.model("TaskLog", TaskLogSchema);