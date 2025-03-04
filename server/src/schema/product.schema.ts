import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        name:{
            type: String,
            required: [true, "Product Name is important"],
            unique: [true, "Product already exists"],
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            default: 1
        },
        description: {
          type: String,
          required: [true, "Description is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        history:[
            {
                type: mongoose.Types.ObjectId, ref: "User"
            }
        ]
    },
    { timestamps: true }
);

export const Products = mongoose.model("Products", ProductSchema);