import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProblemAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  problemTitle: string;
  attemptDate: Date;
  timeSpentMinutes: number;
  outcome: "INDEPENDENT" | "WITH_HINTS" | "SOLUTION_VIEWED" | "FAILED";
  approachTaken?: string;
  notes?: string;
}

const ProblemAttemptSchema = new Schema<IProblemAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    problemId: { type: Schema.Types.ObjectId, ref: "DsaProblem", required: true, index: true },
    problemTitle: { type: String, required: true },
    attemptDate: { type: Date, default: Date.now },
    timeSpentMinutes: { type: Number, default: 30 },
    outcome: {
      type: String,
      enum: ["INDEPENDENT", "WITH_HINTS", "SOLUTION_VIEWED", "FAILED"],
      required: true,
    },
    approachTaken: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ProblemAttempt: Model<IProblemAttempt> =
  mongoose.models.ProblemAttempt || mongoose.model<IProblemAttempt>("ProblemAttempt", ProblemAttemptSchema);
export default ProblemAttempt;
