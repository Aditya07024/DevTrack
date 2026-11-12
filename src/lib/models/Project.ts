import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: "PERSONAL" | "ACADEMIC" | "PROFESSIONAL" | "OPEN_SOURCE";
  techStack: string[];
  repoUrl?: string;
  demoUrl?: string;
  startDate?: string;
  endDate?: string;
  status: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
  milestones: {
    title: string;
    completed: boolean;
    dueDate?: string;
  }[];
  challenges: string[];
  technicalDecisions: string[];
  keyLearnings: string[];
  achievements: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["PERSONAL", "ACADEMIC", "PROFESSIONAL", "OPEN_SOURCE"],
      default: "PERSONAL",
    },
    techStack: { type: [String], default: [] },
    repoUrl: { type: String, default: "" },
    demoUrl: { type: String, default: "" },
    startDate: { type: String },
    endDate: { type: String },
    status: {
      type: String,
      enum: ["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD"],
      default: "IN_PROGRESS",
    },
    milestones: [
      {
        title: { type: String, required: true },
        completed: { type: Boolean, default: false },
        dueDate: { type: String },
      },
    ],
    challenges: { type: [String], default: [] },
    technicalDecisions: { type: [String], default: [] },
    keyLearnings: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
export default Project;
