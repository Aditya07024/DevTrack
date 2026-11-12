import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInterviewQuestion extends Document {
  userId: mongoose.Types.ObjectId;
  question: string;
  category: "DSA" | "CORE_CS" | "SYSTEM_DESIGN" | "BEHAVIORAL" | "PRACTICAL_DEV";
  company?: string;
  round?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  answerNotes: string;
  keyPoints: string[];
  confidence: "NOT_CONFIDENT" | "SOMEWHAT_CONFIDENT" | "CONFIDENT" | "INTERVIEW_READY";
  isWeakTopic: boolean;
  followUpRevisionDate?: string;
  timesPracticed: number;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewQuestionSchema = new Schema<IInterviewQuestion>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    question: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["DSA", "CORE_CS", "SYSTEM_DESIGN", "BEHAVIORAL", "PRACTICAL_DEV"],
      required: true,
      index: true,
    },
    company: { type: String, default: "" },
    round: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "MEDIUM",
    },
    answerNotes: { type: String, default: "" },
    keyPoints: { type: [String], default: [] },
    confidence: {
      type: String,
      enum: ["NOT_CONFIDENT", "SOMEWHAT_CONFIDENT", "CONFIDENT", "INTERVIEW_READY"],
      default: "SOMEWHAT_CONFIDENT",
      index: true,
    },
    isWeakTopic: { type: Boolean, default: false, index: true },
    followUpRevisionDate: { type: String },
    timesPracticed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const InterviewQuestion: Model<IInterviewQuestion> =
  mongoose.models.InterviewQuestion || mongoose.model<IInterviewQuestion>("InterviewQuestion", InterviewQuestionSchema);
export default InterviewQuestion;
