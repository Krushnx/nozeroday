import { connectDB } from "@/lib/db";
import TaskLog from "@/models/TaskLog";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { taskId, status, inputValue, date } = body;

    if (!taskId || !status || !date) {
      return new Response(
        JSON.stringify({ error: "taskId, status and date are required" }),
        { status: 400 }
      );
    }

    if (!["COMPLETED", "PARTIAL"].includes(status)) {
      return new Response(
        JSON.stringify({ error: "Invalid status" }),
        { status: 400 }
      );
    }

    let log = await TaskLog.findOne({ taskId, date });

    if (!log) {
      log = await TaskLog.create({
        taskId,
        date,
        status,
        inputValue: inputValue || "",
        completedAt: new Date(),
      });
    } else {
      log.status = status;
      log.inputValue = inputValue || "";
      log.completedAt = new Date();
      await log.save();
    }

    return new Response(JSON.stringify(log), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}