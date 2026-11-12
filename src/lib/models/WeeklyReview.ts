import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWeeklyReview extends Document {
  userId: mongoose.Types.ObjectId;
  year: number;
  weekNumber: number; // 1-52
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  tasksCompletedCount: number;
  tasksMissedCount: number;
  dsaSolvedCount: number;
  studyHours: number;
  strugglesSummary: string;
  developmentLearnings: string;
  challengesFaced: string;
  prioritiesNextWeek: string[];
  selfRating: number; // 1-5
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WeeklyReviewSchema = new Schema<IWeeklyReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    year: { type: Number, required: true },
    weekNumber: { type: Number, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    tasksCompletedCount: { type: Number, default: 0 },
    tasksMissedCount: { type: Number, default: 0 },
    dsaSolvedCount: { type: Number, default: 0 },
    studyHours: { type: Number, default: 0 },
    strugglesSummary: { type: String, default: "" },
    developmentLearnings: { type: String, default: "" },
    challengesFaced: { type: String, default: "" },
    prioritiesNextWeek: { type: [String], default: [] },
    selfRating: { type: Number, default: 4, min: 1, max: 5 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

WeeklyReviewSchema.index({ userId: 1, year: 1, weekNumber: 1 }, { unique: true });

export const WeeklyReview: Model<IWeeklyReview> =
  mongoose.models.WeeklyReview || mongoose.model<IWeeklyReview>("WeeklyReview", WeeklyReviewSchema);
export default WeeklyReview;
