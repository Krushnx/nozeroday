import { connectDB } from "@/lib/db";
import TaskLog from "@/models/TaskLog";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { taskId, date } = body;

    if (!taskId || !date) {
      return new Response(
        JSON.stringify({ error: "taskId and date are required" }),
        { status: 400 }
      );
    }

    let log = await TaskLog.findOne({ taskId, date });

    if (log) {
      log.status = "SKIPPED";
      log.completedAt = new Date();
      await log.save();
    } else {
      log = await TaskLog.create({
        taskId,
        date,
        status: "SKIPPED",
        completedAt: new Date(),
      });
    }

    return new Response(JSON.stringify(log), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}