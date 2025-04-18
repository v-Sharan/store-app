import mongoose, {
  Document,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";
import { UserType } from "./user.shema";
import bcrypt from "bcrypt";

interface RootUserType extends Document {
  orgname: string;
  orgId: string;
  email: string;
  password: string;
  users: UserType[] | [];
  role: "admin";
}

const salt = bcrypt.genSaltSync(10);

const Schema = mongoose.Schema;

const OrganizationUser = new Schema<RootUserType>(
  {
    orgname: {
      type: String,
      required: [true, "User Name is important"],
      unique: [true, "User already exists"],
    },
    orgId: {
      type: String,
      unique: [true, "Organization ID is Must be unique"],
    },
    email: {
      type: String,
      required: [true, "Email id is required"],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
      required: [true, "Role is required"],
    },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

OrganizationUser.pre<UserType>(
  "save",
  function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) return next();
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();
  }
);

OrganizationUser.method<UserType>("comparpass", function comparpass(password) {
  return bcrypt.compareSync(password, this.password);
});

export const OrgUser = mongoose.model<RootUserType>(
  "OrgUser",
  OrganizationUser
);
