import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDsaTopic extends Document {
  userId?: mongoose.Types.ObjectId; // null for system defaults
  name: string;
  slug: string;
  category: "DATA_STRUCTURE" | "ALGORITHM" | "PARADIGM" | "ADVANCED";
  order: number;
  description?: string;
  isCustom: boolean;
}

const DsaTopicSchema = new Schema<IDsaTopic>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    category: {
      type: String,
      enum: ["DATA_STRUCTURE", "ALGORITHM", "PARADIGM", "ADVANCED"],
      default: "DATA_STRUCTURE",
    },
    order: { type: Number, default: 0 },
    description: { type: String, default: "" },
    isCustom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

DsaTopicSchema.index({ slug: 1, userId: 1 });

export const DsaTopic: Model<IDsaTopic> =
  mongoose.models.DsaTopic || mongoose.model<IDsaTopic>("DsaTopic", DsaTopicSchema);
export default DsaTopic;
