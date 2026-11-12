import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILearningTrack extends Document {
  userId?: mongoose.Types.ObjectId; // null for system defaults
  name: string;
  slug: string;
  category: "DEVELOPMENT" | "CORE_CS" | "SYSTEM_DESIGN";
  description: string;
  order: number;
}

const LearningTrackSchema = new Schema<ILearningTrack>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: {
      type: String,
      enum: ["DEVELOPMENT", "CORE_CS", "SYSTEM_DESIGN"],
      required: true,
    },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const LearningTrack: Model<ILearningTrack> =
  mongoose.models.LearningTrack || mongoose.model<ILearningTrack>("LearningTrack", LearningTrackSchema);
export default LearningTrack;
