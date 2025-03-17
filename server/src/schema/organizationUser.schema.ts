import mongoose,{Document} from "mongoose";
import {UserType} from './user.shema'

interface RootUserType extends Document {
    orgname: string;
    orgId: string;
    email: string;
    password: string;
    users:UserType[] | [];
    role:"admin"
}

const Schema = mongoose.Schema;

const OrganizationUser = new Schema<RootUserType>(
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
        role:{
            type: String,
            enum: ['admin'],
            default: "admin",
            required: [true, "Role is required"]
        },
        users: [{type: Schema.Types.ObjectId, ref: "User"}],
    },
    {timestamps: true}
);

export const OrgUser = mongoose.model<RootUserType>("OrgUser", OrganizationUser);