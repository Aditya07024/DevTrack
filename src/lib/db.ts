import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/devtrack";

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      console.log(`[DevTrack DB] MongoDB Connected successfully to ${uri.replace(/\/\/.*@/, "//***@")}`);
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.error("[DevTrack DB] MongoDB connection failed:", e?.message || e);
    throw new Error(
      `MongoDB connection failed. Please ensure MONGODB_URI is properly configured or MongoDB is running locally. Error: ${e?.message || e}`
    );
  }

  return cached.conn;
}

export default connectToDatabase;
