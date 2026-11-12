import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRevision extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  problemTitle: string;
  topicName: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  intervalDays: number; // 3, 7, 21
  iteration: number; // 1st revision (day 3), 2nd (day 7), 3rd (day 21)
  scheduledDate: string; // YYYY-MM-DD
  status: "PENDING" | "COMPLETED" | "RESCHEDULED" | "SKIPPED";
  completedDate?: string;
  outcome?: "RESOLVED_EASILY" | "RESOLVED_WITH_EFFORT" | "FAILED_NEEDS_PRACTICE";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RevisionSchema = new Schema<IRevision>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: "DsaProblem", required: true, index: true },
    problemTitle: { type: String, required: true },
    topicName: { type: String, required: true },
    difficulty: { type: String, enum: ["EASY", "MEDIUM", "HARD"], default: "MEDIUM" },
    intervalDays: { type: Number, required: true },
    iteration: { type: Number, default: 1 },
    scheduledDate: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "RESCHEDULED", "SKIPPED"],
      default: "PENDING",
      index: true,
    },
    completedDate: { type: String },
    outcome: {
      type: String,
      enum: ["RESOLVED_EASILY", "RESOLVED_WITH_EFFORT", "FAILED_NEEDS_PRACTICE"],
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

RevisionSchema.index({ userId: 1, scheduledDate: 1, status: 1 });

export const Revision: Model<IRevision> =
  mongoose.models.Revision || mongoose.model<IRevision>("Revision", RevisionSchema);
export default Revision;
