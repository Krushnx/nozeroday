import { connectDB } from "@/lib/db";
import Task from "@/models/Task";

// UPDATE TASK
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    const body = await req.json();

    const { name, startMinutes, endMinutes, requiresInput, inputLabel } = body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        name,
        startMinutes,
        endMinutes,
        requiresInput,
        inputLabel,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedTask), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// DELETE TASK
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "Task deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}