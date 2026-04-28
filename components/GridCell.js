"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function GridCell({
  taskId,
  date,
  status,
  requiresInput,
  inputLabel,
  onUpdate,
}) {
  const [loading, setLoading] = useState(false);

  const colors = {
    COMPLETED: "bg-emerald-500",
    PARTIAL: "bg-yellow-400",
    SKIPPED: "bg-gray-400",
    STARTED: "bg-blue-400",
    DEFAULT: "bg-gray-200",
  };

  const bgColor = colors[status] || colors.DEFAULT;

  async function handleClick() {
    let inputValue = "";

    // 🔥 Input flow
    if (requiresInput) {
      const inputRes = await Swal.fire({
        title: inputLabel || "Enter value",
        input: "number",
        inputPlaceholder: "Enter value...",
        showCancelButton: true,
        confirmButtonText: "Next",
        cancelButtonText: "Skip",
        width: "90%",
      });

      if (!inputRes.isConfirmed) {
        await fetch("/api/logs/skip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId, date }),
        });

        onUpdate(taskId, date, "SKIPPED"); // 🔥 instant update
        return;
      }

      inputValue = inputRes.value;
    }

    // 🔥 Status popup
    const result = await Swal.fire({
      title: "Update Task",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "✅ Complete",
      denyButtonText: "🟡 Partial",
      cancelButtonText: "❌ Skip",
      width: "90%",
    });

    setLoading(true);

    try {
      if (result.isConfirmed) {
        await fetch("/api/logs/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskId,
            status: "COMPLETED",
            inputValue,
            date,
          }),
        });

        onUpdate(taskId, date, "COMPLETED", inputValue);
      } else if (result.isDenied) {
        await fetch("/api/logs/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            taskId,
            status: "PARTIAL",
            inputValue,
            date,
          }),
        });

        onUpdate(taskId, date, "PARTIAL", inputValue);
      } else {
        await fetch("/api/logs/skip", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId, date }),
        });

        onUpdate(taskId, date, "SKIPPED");
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div
      onClick={handleClick}
      className={`w-8 h-8 rounded-md ${bgColor} cursor-pointer flex items-center justify-center text-white text-xs active:scale-95 transition`}
    >
      {loading ? "..." : ""}
    </div>
  );
}