import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJobApplication extends Document {
  userId: mongoose.Types.ObjectId;
  company: string;
  role: string;
  country: string;
  city?: string;
  workArrangement: "REMOTE" | "HYBRID" | "ONSITE";
  employmentType: "FULL_TIME" | "CONTRACT" | "INTERNSHIP" | "PART_TIME";
  jobUrl?: string;
  currency: string; // "USD", "INR", "EUR", "GBP", etc.
  salaryMin?: number;
  salaryMax?: number;
  salaryNotes?: string;
  requiredExperience?: string;
  requiredSkills: string[];
  applicationDate: string; // YYYY-MM-DD
  status:
    | "INTERESTED"
    | "APPLIED"
    | "ASSESSMENT"
    | "INTERVIEW_SCHEDULED"
    | "TECHNICAL_ROUND"
    | "HR_ROUND"
    | "OFFER"
    | "REJECTED"
    | "WITHDRAWN";
  resumeVersion?: string;
  referralName?: string;
  notes?: string;
  nextStepDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: "India" },
    city: { type: String, default: "" },
    workArrangement: {
      type: String,
      enum: ["REMOTE", "HYBRID", "ONSITE"],
      default: "REMOTE",
    },
    employmentType: {
      type: String,
      enum: ["FULL_TIME", "CONTRACT", "INTERNSHIP", "PART_TIME"],
      default: "FULL_TIME",
    },
    jobUrl: { type: String, default: "" },
    currency: { type: String, default: "USD" },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryNotes: { type: String, default: "" },
    requiredExperience: { type: String, default: "" },
    requiredSkills: { type: [String], default: [] },
    applicationDate: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: [
        "INTERESTED",
        "APPLIED",
        "ASSESSMENT",
        "INTERVIEW_SCHEDULED",
        "TECHNICAL_ROUND",
        "HR_ROUND",
        "OFFER",
        "REJECTED",
        "WITHDRAWN",
      ],
      default: "APPLIED",
      index: true,
    },
    resumeVersion: { type: String, default: "Standard v1" },
    referralName: { type: String, default: "" },
    notes: { type: String, default: "" },
    nextStepDate: { type: String },
  },
  { timestamps: true }
);

JobApplicationSchema.index({ userId: 1, status: 1 });
JobApplicationSchema.index({ userId: 1, country: 1 });

export const JobApplication: Model<IJobApplication> =
  mongoose.models.JobApplication || mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
export default JobApplication;
