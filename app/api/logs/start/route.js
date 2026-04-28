import { connectDB } from "@/lib/db";
import TaskLog from "@/models/TaskLog";

function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { taskId, date } = body;

    if (!taskId) {
      return new Response(JSON.stringify({ error: "taskId is required" }), {
        status: 400,
      });
    }

    const logDate = date || getTodayDate();

    let log = await TaskLog.findOne({ taskId, date: logDate });

    if (log) {
      log.status = "STARTED";
      log.startedAt = new Date();
      await log.save();
    } else {
      log = await TaskLog.create({
        taskId,
        date: logDate,
        status: "STARTED",
        startedAt: new Date(),
      });
    }

    return new Response(JSON.stringify(log), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}