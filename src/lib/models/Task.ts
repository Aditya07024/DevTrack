import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  planId?: mongoose.Types.ObjectId;
  goalId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  category: "DSA" | "DEV" | "CORE_CS" | "SYSTEM_DESIGN" | "PROJECT" | "APPLICATION" | "REVISION" | "GENERAL";
  scheduledDate: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD
  estimatedMinutes: number;
  actualMinutes: number;
  completedAt?: Date;
  rescheduledFrom?: string; // YYYY-MM-DD
  rescheduleHistory?: { fromDate: string; toDate: string; reason?: string; timestamp: Date }[];
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan" },
    goalId: { type: Schema.Types.ObjectId, ref: "Goal" },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "TODO",
      index: true,
    },
    category: {
      type: String,
      enum: ["DSA", "DEV", "CORE_CS", "SYSTEM_DESIGN", "PROJECT", "APPLICATION", "REVISION", "GENERAL"],
      default: "GENERAL",
    },
    scheduledDate: { type: String, required: true, index: true },
    dueDate: { type: String },
    estimatedMinutes: { type: Number, default: 45 },
    actualMinutes: { type: Number, default: 0 },
    completedAt: { type: Date },
    rescheduledFrom: { type: String },
    rescheduleHistory: [
      {
        fromDate: { type: String },
        toDate: { type: String },
        reason: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    tags: { type: [String], default: [] },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

TaskSchema.index({ userId: 1, scheduledDate: 1, status: 1 });

export const Task: Model<ITask> = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
export default Task;
