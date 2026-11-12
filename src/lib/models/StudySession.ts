import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudySession extends Document {
  userId: mongoose.Types.ObjectId;
  taskId?: mongoose.Types.ObjectId;
  category: "DSA" | "DEV" | "CORE_CS" | "SYSTEM_DESIGN" | "PROJECT" | "INTERVIEW" | "GENERAL";
  title: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  startTime: Date;
  endTime?: Date;
  notes?: string;
  createdAt: Date;
}

const StudySessionSchema = new Schema<IStudySession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    category: {
      type: String,
      enum: ["DSA", "DEV", "CORE_CS", "SYSTEM_DESIGN", "PROJECT", "INTERVIEW", "GENERAL"],
      default: "DSA",
    },
    title: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    date: { type: String, required: true, index: true },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

StudySessionSchema.index({ userId: 1, date: 1 });

export const StudySession: Model<IStudySession> =
  mongoose.models.StudySession || mongoose.model<IStudySession>("StudySession", StudySessionSchema);
export default StudySession;
