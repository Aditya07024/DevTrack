import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILearningTopic extends Document {
  userId: mongoose.Types.ObjectId;
  trackId?: mongoose.Types.ObjectId;
  trackName: string;
  category: "DEVELOPMENT" | "CORE_CS" | "SYSTEM_DESIGN";
  title: string;
  subtopics: { title: string; completed: boolean }[];
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  confidence: "NOT_STARTED" | "BEGINNER" | "INTERMEDIATE" | "STRONG" | "INTERVIEW_READY";
  notes?: string;
  resources: { title: string; url: string }[];
  lastStudiedDate?: Date;
  nextRevisionDate?: string; // YYYY-MM-DD
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const LearningTopicSchema = new Schema<ILearningTopic>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    trackId: { type: Schema.Types.ObjectId, ref: "LearningTrack" },
    trackName: { type: String, required: true },
    category: {
      type: String,
      enum: ["DEVELOPMENT", "CORE_CS", "SYSTEM_DESIGN"],
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    subtopics: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
      default: "NOT_STARTED",
      index: true,
    },
    confidence: {
      type: String,
      enum: ["NOT_STARTED", "BEGINNER", "INTERMEDIATE", "STRONG", "INTERVIEW_READY"],
      default: "NOT_STARTED",
      index: true,
    },
    notes: { type: String, default: "" },
    resources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    lastStudiedDate: { type: Date },
    nextRevisionDate: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

LearningTopicSchema.index({ userId: 1, category: 1, status: 1 });

export const LearningTopic: Model<ILearningTopic> =
  mongoose.models.LearningTopic || mongoose.model<ILearningTopic>("LearningTopic", LearningTopicSchema);
export default LearningTopic;
