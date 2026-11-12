import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  body: string;
  type: "DAILY_REMINDER" | "TASK_DEADLINE" | "DSA_REVISION" | "WEEKLY_REVIEW" | "MONTHLY_GOAL" | "SYSTEM";
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: {
      type: String,
      enum: ["DAILY_REMINDER", "TASK_DEADLINE", "DSA_REVISION", "WEEKLY_REVIEW", "MONTHLY_GOAL", "SYSTEM"],
      default: "SYSTEM",
    },
    link: { type: String, default: "/overview" },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
export default Notification;
