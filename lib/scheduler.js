import cron from "node-cron";
import Task from "@/models/Task";
import webpush from "web-push";

let subscription = null;

// 🔧 Set subscription from API
export function setSubscription(sub) {
  subscription = sub;
}

// ⏱️ Current time in minutes
function getCurrentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function startScheduler() {
  console.log("🚀 Scheduler started");

  cron.schedule("* * * * *", async () => {
    try {
      if (!subscription) return;

      const currentMinutes = getCurrentMinutes();

      const tasks = await Task.find();

      for (const task of tasks) {
        // 🔔 Start notification
        if (task.startMinutes === currentMinutes) {
          await webpush.sendNotification(
            subscription,
            JSON.stringify({
              title: `⏰ ${task.name}`,
              body: "Start now",
            })
          );
        }

        // 🔔 End notification
        if (task.endMinutes === currentMinutes) {
          await webpush.sendNotification(
            subscription,
            JSON.stringify({
              title: `⏰ ${task.name}`,
              body: "Time to mark complete",
            })
          );
        }
      }
    } catch (err) {
      console.error("Scheduler error:", err);
    }
  });
}