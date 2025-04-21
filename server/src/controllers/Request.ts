import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { HttpError } from "../utils/HttpError";
import { ProductRequest } from "../schema/ProductRequest.schema";
import { Products } from "../schema/product.schema";
import { AuthRequest } from "../middleware/JWTAuth";

export const CreateRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { productId, quantity } = req.body;
  let prod,
    user = req.user;
  try {
    prod = await Products.findById(productId);
  } catch (e: any) {
    const error = new HttpError(`Error: ${e?.message}`, 500);
    return next(error);
  }
  if (!prod) {
    const error = new HttpError("No Product in this Product id", 500);
    return next(error);
  }
  const isRequestAble = prod.quantity > 0 && quantity <= prod.quantity;
  if (!isRequestAble) {
    const error = new HttpError(
      `Requested product Quantity of ${quantity} is very low!.Only ${prod.quantity} is available`,
      500
    );
    4;
    return next(error);
  }
  try {
    const request = new ProductRequest({
      userId: user._id,
      orgId: user.orgId,
      productId,
      quantity,
    });
    await request.save();
    const userUpdate = await user.updateOne(
      { $push: { history: request._id } },
      { new: true }
    );
    await prod.updateOne({ $inc: { quantity: -quantity } });
    res.json({ message: request });
  } catch (e: any) {
    const error = new HttpError(
      `Error While Creating Request ${e?.message}`,
      500
    );
    return next(error);
  }
};

export const deleteRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const request = await ProductRequest.findById(id);
  if (!request) {
    return next(new HttpError("No Request found", 404));
  }
  res.json({ message: "Delete Request" });
  // try {
  //   const prod = await Products.findById(request.productId);
  //   if (!prod) {
  //     const error = new HttpError(`Product not available`, 402);
  //     return next(error);
  //   }
  //   await prod.updateOne();
  //   await request.deleteOne();
  //   res.json({ message: "Request deleted successfully" });
  // } catch (e: any) {
  //   const error = new HttpError(`Error: ${e?.message}`, 500);
  //   return next(error);
  // }
};

export const updateStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { productId: requestId, status } = req.query;
  if (!["approved", "rejected"].includes(status as string)) {
    next(new HttpError("Invalid status value", 402));
  }

  const user = req.user;
  if (user.role !== "admin") {
    return next(
      new HttpError("You are not authorized to update product status", 401)
    );
  }

  let request;
  try {
    request = await ProductRequest.findOne({ _id: requestId });
    if (!request) {
      return next(new HttpError(`Product with id ${requestId} not found`, 404));
    }
    if (request.status !== "pending") {
      return next(new HttpError(`Product is already ${request.status}`, 402));
    }
    await request.updateOne({ $set: { status: status } }, { new: true });
  } catch (err: any) {
    const error = new HttpError(`Something went wrong!.${err?.message}`, 422);
    return next(error);
  }
};
