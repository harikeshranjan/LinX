import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
}, {
  timestamps: true,
})

userSchema.pre("save", async function (next) {
  if (this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
})

const User = models?.User || model<IUser>("User", userSchema);

export default User;