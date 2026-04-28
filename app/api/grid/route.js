import { connectDB } from "@/lib/db";
import Task from "@/models/Task";
import TaskLog from "@/models/TaskLog";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: "startDate and endDate required" }),
        { status: 400 }
      );
    }

    const tasks = await Task.find();

    const logs = await TaskLog.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const logMap = {};

    logs.forEach((log) => {
      const taskId = log.taskId.toString();

      if (!logMap[taskId]) logMap[taskId] = {};

      logMap[taskId][log.date] = {
        status: log.status,
        inputValue: log.inputValue,
      };
    });

    // 🔥 TASK DATA + STREAK
    const result = tasks.map((task) => {
      const taskLogs = logMap[task._id.toString()] || {};

      let streak = 0;
      const today = new Date();

      for (let i = 0; i < 365; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];

        const log = taskLogs[dateStr];

        if (log && (log.status === "COMPLETED" || log.status === "PARTIAL")) {
          streak++;
        } else {
          break;
        }
      }

      return {
        taskId: task._id,
        taskName: task.name,
        streak,
        requiresInput: task.requiresInput || false,
        inputLabel: task.inputLabel || "Input",
        logs: taskLogs,
      };
    });

    // 🔥 OVERALL STREAK
    let overallStreak = 0;
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const allCompleted = tasks.every((task) => {
        const taskLogs = logMap[task._id.toString()] || {};
        const log = taskLogs[dateStr];
        return log && log.status === "COMPLETED";
      });

      if (allCompleted) overallStreak++;
      else break;
    }

    return new Response(
      JSON.stringify({
        tasks: result,
        overallStreak,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}