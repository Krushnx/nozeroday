import mongoose from "mongoose";
import { startScheduler } from "./scheduler";

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGODB_URI");
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const db = await mongoose.connect(MONGO_URI);
  isConnected = db.connections[0].readyState;

  console.log("✅ MongoDB connected");

  // 🔥 Start scheduler ONLY ONCE
  startScheduler();
}