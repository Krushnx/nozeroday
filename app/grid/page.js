"use client";

import { useEffect, useState } from "react";
import Grid from "@/components/Grid";

// 🔧 Helper
function urlBase64ToUint8Array(base64String) {
  if (!base64String) throw new Error("Missing VAPID key");

  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export default function GridPage() {
  const [data, setData] = useState(null);

  // 🔥 Fetch grid data
  async function getData() {
    const today = new Date();
    const endDate = today.toISOString().split("T")[0];

    const start = new Date();
    start.setDate(today.getDate() - 29);
    const startDate = start.toISOString().split("T")[0];

    const res = await fetch(
      `/api/grid?startDate=${startDate}&endDate=${endDate}`
    );

    const json = await res.json();
    setData(json);
  }

  // 🔥 Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("✅ Service Worker Registered"))
        .catch((err) => console.error("❌ SW error", err));
    } else {
      console.warn("⚠️ Service Worker not supported");
    }

    getData();
  }, []);

  // 🔔 Subscribe (FIXED)
  async function subscribeUser() {
    try {
      // ✅ Check support
      if (!("serviceWorker" in navigator)) {
        alert("Service Worker not supported on this browser");
        return;
      }

      // ✅ Ask permission FIRST
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        alert("Notification permission denied");
        return;
      }

      const reg = await navigator.serviceWorker.ready;

      // ✅ Check existing subscription
      let subscription = await reg.pushManager.getSubscription();

      if (!subscription) {
        subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
          ),
        });
      }

      console.log("🔥 SUBSCRIPTION:", JSON.stringify(subscription));
      alert("Notifications enabled!");

    } catch (err) {
      console.error("❌ ERROR:", err);
      alert(err.message || "Subscription failed");
    }
  }

  // 🔔 Test notification
  async function sendTestNotification() {
    try {
      if (!("serviceWorker" in navigator)) {
        alert("Service Worker not supported");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();

      if (!sub) {
        alert("Enable notifications first");
        return;
      }

      await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription: sub }),
      });

      alert("Notification sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send notification");
    }
  }

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 md:p-6">

      {/* 🔔 Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={subscribeUser}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Enable Notifications
        </button>

        <button
          onClick={sendTestNotification}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Test Notification
        </button>
      </div>

      {/* 🔥 Streak */}
      <div className="mb-4 text-sm text-gray-600">
        🔥 Overall Streak:{" "}
        <span className="font-semibold">
          {data.overallStreak}
        </span>
      </div>

      {/* 🔥 Grid */}
      <Grid data={data.tasks} />
    </div>
  );
}