import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserSettings extends Document {
  userId: mongoose.Types.ObjectId;
  targetRole: string;
  targetCompanyCategory: string[];
  careerGoalSummary: string;
  dailyStudyHoursTarget: number;
  workingDays: number[]; // 0=Sunday, 1=Monday, etc.
  timezone: string;
  preferredCurrency: string;
  notificationPreferences: {
    dailyReminderTime: string; // "20:00"
    dailyReminderEnabled: boolean;
    taskDeadlineEnabled: boolean;
    dsaRevisionEnabled: boolean;
    weeklyReviewEnabled: boolean;
    monthlyGoalEnabled: boolean;
  };
  revisionIntervals: number[]; // default [3, 7, 21]
}

const UserSettingsSchema = new Schema<IUserSettings>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    targetRole: { type: String, default: "Full-Stack Software Engineer" },
    targetCompanyCategory: {
      type: [String],
      default: [
        "Product-based Companies",
        "High-Growth Startups",
        "Remote US/International Engineering",
        "FAANG & Global Tech",
      ],
    },
    careerGoalSummary: {
      type: String,
      default: "Crack high-impact software engineering roles (India & Remote International) through systematic DSA, System Design, and Modern Web Architecture preparation.",
    },
    dailyStudyHoursTarget: { type: Number, default: 3.5 },
    workingDays: { type: [Number], default: [1, 2, 3, 4, 5, 6] },
    timezone: { type: String, default: "Asia/Kolkata" },
    preferredCurrency: { type: String, default: "USD" },
    notificationPreferences: {
      dailyReminderTime: { type: String, default: "20:00" },
      dailyReminderEnabled: { type: Boolean, default: true },
      taskDeadlineEnabled: { type: Boolean, default: true },
      dsaRevisionEnabled: { type: Boolean, default: true },
      weeklyReviewEnabled: { type: Boolean, default: true },
      monthlyGoalEnabled: { type: Boolean, default: true },
    },
    revisionIntervals: { type: [Number], default: [3, 7, 21] },
  },
  { timestamps: true }
);

export const UserSettings: Model<IUserSettings> =
  mongoose.models.UserSettings || mongoose.model<IUserSettings>("UserSettings", UserSettingsSchema);
export default UserSettings;
