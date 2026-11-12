import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb+srv://adityakumar07024_db_user:uFiprHrJ5hQQEDOx@cluster0.plxylon.mongodb.net/devtrack?retryWrites=true&w=majority";

async function clearDatabase() {
  console.log("[DevTrack Clean] Connecting to MongoDB Atlas...");
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  console.log("[DevTrack Clean] Found collections:", collections.map((c) => c.name));

  for (const c of collections) {
    if (c.name === "users") {
      // Keep Aditya07024 user account so login remains active
      const res = await db.collection("users").deleteMany({ email: { $ne: "adityakumar07024@gmail.com" } });
      console.log(`[DevTrack Clean] Cleaned 'users' collection (kept Aditya07024). Deleted: ${res.deletedCount}`);
    } else {
      const res = await db.collection(c.name).deleteMany({});
      console.log(`[DevTrack Clean] Emptied '${c.name}' (Deleted: ${res.deletedCount} documents)`);
    }
  }

  console.log("[DevTrack Clean] All database collections cleared successfully!");
  await mongoose.disconnect();
}

clearDatabase().catch((err) => {
  console.error("[DevTrack Clean] Error:", err);
  process.exit(1);
});
