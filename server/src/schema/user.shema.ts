import mongoose, {
  Document,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";
import { ReqProduct } from "./ProductRequest.schema";
import bcrypt from "bcrypt";
export interface UserType extends Document {
  orgId: string;
  email: string;
  username: string;
  password: string;
  history: ReqProduct[] | [];
  role: "user" | "store";
}
const salt = bcrypt.genSaltSync(10);

const Schema = mongoose.Schema;

const UserSchema = new Schema<UserType>(
  {
    orgId: {
      type: String,
      required: [true, "orgId is important"],
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

UserSchema.pre<UserType>(
  "save",
  function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) return next();
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();
  }
);

UserSchema.method("comparpass", function comparpass(password) {
  return bcrypt.compareSync(password, this.password);
});

export const User = mongoose.model<UserType>("User", UserSchema);
