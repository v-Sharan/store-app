import mongoose,{Document} from "mongoose";

interface IProduct {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
}

export interface ReqProduct extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    orgId: string;
    items: IProduct[] | [],
    status:"pending" | "rejected" | "approved",
}

const Schema = mongoose.Schema;

const RequestProductSchema = new Schema<ReqProduct>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        orgId: { type: String, required: true },
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true },
            },
        ],
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    },
    { timestamps: true }
);

export const ProductRequest = mongoose.model<ReqProduct>("RequestProduct", RequestProductSchema);