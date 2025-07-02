import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    required: [true, "User Name is required"],
    trim: true,
    minLength: 2,
    maxLength: 50,
  },
  {
    email: {
      type: String,
      required: [true, "User Email is rewuired"],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 5,
      maxLength: 255,
      match: [/\s+@\S+\.\S+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      minLength: 6,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
