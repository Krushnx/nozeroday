"use client";

import { useState } from "react";
import GridCell from "./GridCell";

function generateDates(days = 30) {
  const dates = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dates.push(d);
  }

  return dates;
}

export default function Grid({ data }) {
  const [gridData, setGridData] = useState(data);
  const dates = generateDates();
  const todayStr = new Date().toISOString().split("T")[0];

  // 🔥 Update UI instantly
  function updateLocal(taskId, date, status, inputValue = "") {
    setGridData((prev) =>
      prev.map((task) => {
        if (task.taskId !== taskId) return task;

        return {
          ...task,
          logs: {
            ...task.logs,
            [date]: { status, inputValue },
          },
        };
      })
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
      <div className="min-w-max">

        {/* MONTH */}
        <div className="flex gap-1 mb-1">
          <div className="w-40 sticky left-0 bg-white z-10"></div>

          {dates.map((d, i) => {
            const month = d.toLocaleString("default", { month: "short" });
            const prevMonth =
              i > 0
                ? dates[i - 1].toLocaleString("default", { month: "short" })
                : null;

            return (
              <div key={i} className="w-8 text-center text-xs text-gray-500">
                {i === 0 || month !== prevMonth ? month : ""}
              </div>
            );
          })}
        </div>

        {/* WEEK */}
        <div className="flex gap-1 mb-1">
          <div className="w-40 sticky left-0 bg-white z-10"></div>

          {dates.map((d, i) => (
            <div key={i} className="w-8 text-center text-[10px] text-gray-400">
              {d.toLocaleString("default", { weekday: "short" }).slice(0, 2)}
            </div>
          ))}
        </div>

        {/* DATE */}
        <div className="flex gap-1 mb-3">
          <div className="w-40 sticky left-0 bg-white z-10"></div>

          {dates.map((d, i) => {
            const dateStr = d.toISOString().split("T")[0];
            const isToday = dateStr === todayStr;

            return (
              <div
                key={i}
                className={`w-8 text-center text-xs ${
                  isToday ? "font-bold text-black" : "text-gray-400"
                }`}
              >
                {d.getDate()}
              </div>
            );
          })}
        </div>

        {/* TASKS */}
        {gridData.map((task) => (
          <div key={task.taskId} className="flex items-center gap-1 mb-2">

            <div className="w-40 sticky left-0 bg-white z-10 text-sm pr-2">
              <div className="font-medium text-gray-700">
                {task.taskName}
              </div>
              <div className="text-xs text-gray-400">
                🔥 {task.streak}
              </div>
            </div>

            {dates.map((d, i) => {
              const dateStr = d.toISOString().split("T")[0];
              const log = task.logs[dateStr];

              return (
                <GridCell
                  key={i}
                  taskId={task.taskId}
                  date={dateStr}
                  status={log?.status}
                  requiresInput={task.requiresInput}
                  inputLabel={task.inputLabel}
                  onUpdate={updateLocal} // 🔥
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}