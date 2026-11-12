import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: "DSA" | "DEVELOPMENT" | "SYSTEM_DESIGN" | "CAREER" | "PROJECT" | "CORE_CS";
  targetMonth: number; // 1-12
  targetYear: number;
  targetCount: number;
  currentCount: number;
  metricLabel: string; // e.g. "problems", "projects", "mock interviews", "chapters"
  status: "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
  keyResults: string[];
  createdAt: Date;
  updatedAt: Date;
}

const GoalSchema = new Schema<IGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["DSA", "DEVELOPMENT", "SYSTEM_DESIGN", "CAREER", "PROJECT", "CORE_CS"],
      default: "DSA",
    },
    targetMonth: { type: Number, required: true },
    targetYear: { type: Number, required: true },
    targetCount: { type: Number, default: 0 },
    currentCount: { type: Number, default: 0 },
    metricLabel: { type: String, default: "items" },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED", "ARCHIVED"],
      default: "IN_PROGRESS",
    },
    keyResults: { type: [String], default: [] },
  },
  { timestamps: true }
);

GoalSchema.index({ userId: 1, targetYear: 1, targetMonth: 1 });

export const Goal: Model<IGoal> = mongoose.models.Goal || mongoose.model<IGoal>("Goal", GoalSchema);
export default Goal;
