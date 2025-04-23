import mongoose, { Schema, model, models } from "mongoose";

interface CustomLink {
  _id?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  originalLink: string;
  customLink: string;
  clicks?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const customLinkSchema = new Schema<CustomLink>({
  originalLink: {
    type: String,
    required: true,
    trim: true,
  }, 
  customLink: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
})

const CustomLink = models.CustomLink || model<CustomLink>("CustomLink", customLinkSchema);

export default CustomLink;