import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlan extends Document {
  userId: mongoose.Types.ObjectId;
  goalId?: mongoose.Types.ObjectId;
  type: "MONTHLY" | "WEEKLY";
  title: string;
  year: number;
  month: number; // 1-12
  weekNumber?: number; // 1-52 for weekly
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  priorities: string[];
  dsaTargetProblems: number;
  dsaSolvedProblems: number;
  devStudyTargetHours: number;
  devStudyActualHours: number;
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    goalId: { type: Schema.Types.ObjectId, ref: "Goal" },
    type: { type: String, enum: ["MONTHLY", "WEEKLY"], required: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    weekNumber: { type: Number },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    priorities: { type: [String], default: [] },
    dsaTargetProblems: { type: Number, default: 0 },
    dsaSolvedProblems: { type: Number, default: 0 },
    devStudyTargetHours: { type: Number, default: 0 },
    devStudyActualHours: { type: Number, default: 0 },
    status: { type: String, enum: ["DRAFT", "ACTIVE", "COMPLETED"], default: "ACTIVE" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

PlanSchema.index({ userId: 1, type: 1, year: 1, month: 1, weekNumber: 1 });

export const Plan: Model<IPlan> = mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema);
export default Plan;
