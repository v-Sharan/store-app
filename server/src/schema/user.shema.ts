import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        OrgName: {
            type: String,
            required: [true, "User Name is important"],
            unique: [true, "User already exists"],
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
        products: [{
            type: mongoose.Types.ObjectId, ref: "Products"
        }]
    },
    {timestamps: true}
);

export const User = mongoose.model("User", UserSchema);