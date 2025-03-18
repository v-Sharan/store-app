import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import { HttpError } from "../utils/HttpError";
import { OrgUser as RootUser } from "../schema/organizationUser.schema";
import { ProductRequest } from "../schema/ProductRequest.schema";
import { Products } from "../schema/product.schema";
import { User } from "../schema/user.shema";

export const CreateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { userId, orgId, productId, quantity } = req.body;

  let prod, user;
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
      `Requested product Quantity of ${quantity} is very low`,
      500
    );
    4;
    return next(error);
  }
  try {
    user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
  } catch (e: any) {
    const error = new HttpError(`Error: ${e?.message}`, 500);
    return next(error);
  }
  try {
    const request = new ProductRequest({
      userId: userId,
      orgId: orgId,
      items: [{ productId, quantity }],
    });
    await request.save();
    user.updateOne({ $push: { history: request._id } });
    prod.updateOne({ $inc: { quantity: -quantity } });
  } catch (e: any) {
    const error = new HttpError(
      `Error While Creating Request ${e?.message}`,
      500
    );
    return next(error);
  }
};
