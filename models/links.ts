import mongoose, { Schema, model, models } from "mongoose";

interface Link {
  _id?: mongoose.Types.ObjectId;
  originalUrl: string;
  shortenedUrl: string;
  clicks: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const linkSchema = new Schema<Link>({
  originalUrl: {
    type: String,
    required: true,
    trim: true,
  },
  shortenedUrl: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
});

const Link = models.Link || model<Link>("Link", linkSchema);

export default Link;