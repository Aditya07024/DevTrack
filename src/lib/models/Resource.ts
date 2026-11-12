import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResource extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  url: string;
  category: "DSA" | "SYSTEM_DESIGN" | "FRONTEND" | "BACKEND" | "DEVOPS" | "CAREER" | "ARTICLE" | "BOOK";
  tags: string[];
  description?: string;
  isFavorite: boolean;
  relatedDsaTopic?: string;
  relatedLearningTopic?: string;
  relatedProject?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["DSA", "SYSTEM_DESIGN", "FRONTEND", "BACKEND", "DEVOPS", "CAREER", "ARTICLE", "BOOK"],
      default: "DSA",
    },
    tags: { type: [String], default: [] },
    description: { type: String, default: "" },
    isFavorite: { type: Boolean, default: false, index: true },
    relatedDsaTopic: { type: String, default: "" },
    relatedLearningTopic: { type: String, default: "" },
    relatedProject: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Resource: Model<IResource> =
  mongoose.models.Resource || mongoose.model<IResource>("Resource", ResourceSchema);
export default Resource;
