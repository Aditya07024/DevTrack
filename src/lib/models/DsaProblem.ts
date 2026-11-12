import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDsaProblem extends Document {
  userId: mongoose.Types.ObjectId;
  topicId?: mongoose.Types.ObjectId;
  topicName: string;
  title: string;
  platform: "LeetCode" | "GeeksforGeeks" | "Codeforces" | "HackerRank" | "NeetCode" | "Other";
  url?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status:
    | "NOT_STARTED"
    | "ATTEMPTED"
    | "SOLVED_INDEPENDENTLY"
    | "SOLVED_WITH_HINTS"
    | "SOLUTION_VIEWED"
    | "NEEDS_REVISION";
  timeComplexity?: string;
  spaceComplexity?: string;
  approach?: string;
  notes?: string;
  codeSnippet?: string;
  firstSolvedDate?: Date;
  lastAttemptDate?: Date;
  attemptCount: number;
  solvedCount: number;
  revisionCount: number;
  nextRevisionDate?: string; // YYYY-MM-DD
  createdAt: Date;
  updatedAt: Date;
}

const DsaProblemSchema = new Schema<IDsaProblem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    topicId: { type: Schema.Types.ObjectId, ref: "DsaTopic" },
    topicName: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    platform: {
      type: String,
      enum: ["LeetCode", "GeeksforGeeks", "Codeforces", "HackerRank", "NeetCode", "Other"],
      default: "LeetCode",
    },
    url: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: [
        "NOT_STARTED",
        "ATTEMPTED",
        "SOLVED_INDEPENDENTLY",
        "SOLVED_WITH_HINTS",
        "SOLUTION_VIEWED",
        "NEEDS_REVISION",
      ],
      default: "NOT_STARTED",
      index: true,
    },
    timeComplexity: { type: String, default: "" },
    spaceComplexity: { type: String, default: "" },
    approach: { type: String, default: "" },
    notes: { type: String, default: "" },
    codeSnippet: { type: String, default: "" },
    firstSolvedDate: { type: Date },
    lastAttemptDate: { type: Date },
    attemptCount: { type: Number, default: 0 },
    solvedCount: { type: Number, default: 0 },
    revisionCount: { type: Number, default: 0 },
    nextRevisionDate: { type: String, index: true },
  },
  { timestamps: true }
);

DsaProblemSchema.index({ userId: 1, difficulty: 1 });
DsaProblemSchema.index({ userId: 1, status: 1 });

export const DsaProblem: Model<IDsaProblem> =
  mongoose.models.DsaProblem || mongoose.model<IDsaProblem>("DsaProblem", DsaProblemSchema);
export default DsaProblem;
