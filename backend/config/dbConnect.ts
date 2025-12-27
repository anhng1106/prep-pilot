import mongoose from "mongoose";

// Prefer MONGODB_URI; in development, allow LOCAL override with fallback
const MONGODB_URI =
  process.env.NODE_ENV === "development"
    ? process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI
    : process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MongoDB connection string. Set MONGODB_URI (and optionally MONGODB_URI_LOCAL for dev) in your environment."
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI!, {
        serverSelectionTimeoutMS: 5000,
      })
      .then((mongoose) => mongoose)
      .catch((err) => {
        // Surface a clearer error when local MongoDB isn't running
        const hint =
          process.env.NODE_ENV === "development" &&
          (MONGODB_URI.includes("localhost") || MONGODB_URI.includes("127.0.0.1") || MONGODB_URI.includes("::1"))
            ? "Ensure local MongoDB is running, or set MONGODB_URI to a remote cluster (e.g., MongoDB Atlas)."
            : "Verify your MONGODB_URI is reachable.";
        err.message = `${err.message}\nHint: ${hint}`;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
