import { connectDB } from "@/lib/db";
import Task from "@/models/Task";

// CREATE TASK
export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, startMinutes, endMinutes, requiresInput, inputLabel } = body;

    // basic validation
    if (!name || startMinutes == null || endMinutes == null) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const task = await Task.create({
      name,
      startMinutes,
      endMinutes,
      requiresInput: requiresInput || false,
      inputLabel: inputLabel || "",
    });

    return new Response(JSON.stringify(task), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// GET ALL TASKS
export async function GET() {
  try {
    await connectDB();

    const tasks = await Task.find().sort({ startMinutes: 1 });

    return new Response(JSON.stringify(tasks), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}