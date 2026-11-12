import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  applicationId?: mongoose.Types.ObjectId;
  company: string;
  role: string;
  roundName: string; // e.g. "Screening", "DSA Technical Round 1", "System Design", "HM Round"
  roundType: "ONLINE_ASSESSMENT" | "TECHNICAL_DSA" | "SYSTEM_DESIGN" | "CORE_CS" | "HIRING_MANAGER" | "BEHAVIORAL";
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:mm
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "RESCHEDULED";
  interviewerInfo?: string;
  questions: string[];
  topicsTested: string[];
  feedback?: string;
  outcome: "PENDING" | "PASSED" | "REJECTED" | "AWAITING_FEEDBACK";
  nextSteps?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId, ref: "JobApplication" },
    company: { type: String, required: true },
    role: { type: String, required: true },
    roundName: { type: String, required: true },
    roundType: {
      type: String,
      enum: ["ONLINE_ASSESSMENT", "TECHNICAL_DSA", "SYSTEM_DESIGN", "CORE_CS", "HIRING_MANAGER", "BEHAVIORAL"],
      default: "TECHNICAL_DSA",
    },
    scheduledDate: { type: String, required: true, index: true },
    scheduledTime: { type: String },
    status: {
      type: String,
      enum: ["SCHEDULED", "COMPLETED", "CANCELLED", "RESCHEDULED"],
      default: "SCHEDULED",
    },
    interviewerInfo: { type: String, default: "" },
    questions: { type: [String], default: [] },
    topicsTested: { type: [String], default: [] },
    feedback: { type: String, default: "" },
    outcome: {
      type: String,
      enum: ["PENDING", "PASSED", "REJECTED", "AWAITING_FEEDBACK"],
      default: "PENDING",
    },
    nextSteps: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Interview: Model<IInterview> =
  mongoose.models.Interview || mongoose.model<IInterview>("Interview", InterviewSchema);
export default Interview;
