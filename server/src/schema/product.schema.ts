import mongoose,{Document} from "mongoose";

export interface ProductType extends Document{
    name: string;
    description: string;
    quantity: number;
    orgId: string;
    category: string;
}

const Schema = mongoose.Schema;

const ProductSchema = new Schema<ProductType>(
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
        orgId:{
            type: String,
            unique: [true, "Organization ID is Must be unique"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
    },
    { timestamps: true }
);

export const Products = mongoose.model<ProductType>("Products", ProductSchema);