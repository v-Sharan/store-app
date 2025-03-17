import mongoose, { Document } from "mongoose";
import { ReqProduct } from "./ProductRequest.schema";

export interface UserType extends Document {
  orgId: string;
  userId: string;
  email: string;
  username: string;
  password: string;
  history: ReqProduct[] | [];
  role: "user" | "store";
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<UserType>(
  {
    orgId: {
      type: String,
      required: [true, "orgId is important"],
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: [true, "User ID is unique"],
    },
    email: {
      type: String,
      required: [true, "Email id is required"],
      unique: [true, "Email already exists"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exists"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    history: [
      {
        type: Schema.Types.ObjectId,
        ref: "RequestProduct",
      },
    ],
    role: {
      type: String,
      enum: ["user", "store"],
      default: "user",
      required: [true, "Role is required"],
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<UserType>("User", UserSchema);
