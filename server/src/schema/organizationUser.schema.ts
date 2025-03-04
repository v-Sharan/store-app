import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrganizationUser = new Schema(
    {
        orgname: {
            type: String,
            required: [true, "User Name is important"],
            unique: [true, "User already exists"],
        },
        orgId:{
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
            required: [true, "Password is required"]
        },
        users: [{type: mongoose.Types.ObjectId, ref: "User"}],
    },
    {timestamps: true}
);

export const OrgUser = mongoose.model("OrgUser", OrganizationUser);