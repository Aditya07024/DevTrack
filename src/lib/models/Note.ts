import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string; // Markdown supported
  category: "DSA" | "SYSTEM_DESIGN" | "DEV" | "INTERVIEW" | "GENERAL";
  tags: string[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, default: "" },
    category: {
      type: String,
      enum: ["DSA", "SYSTEM_DESIGN", "DEV", "INTERVIEW", "GENERAL"],
      default: "GENERAL",
    },
    tags: { type: [String], default: [] },
    isPinned: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);
export default Note;
