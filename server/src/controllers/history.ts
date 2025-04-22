import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";

import { HttpError } from "../utils/HttpError";
import { AuthRequest } from "../middleware/JWTAuth";
import { ProductRequest } from "../schema/ProductRequest.schema";

export const getHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) {
    return next(new HttpError("User Not found", 401));
  }
  const populatedUser = await user.populate({
    path: "history",
    select: "-_id -userId -orgId",
    populate: {
      path: "productId",
      model: "Products",
      select: "-_id -description -orgId",
    },
  });
  if (populatedUser.history === 0) {
    return next(new HttpError("No History Found!.", 422));
  }
  res.json({ history: populatedUser.history });
};

export const getOrgHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) {
    return next(new HttpError("User Not found", 401));
  }
  let his;
  try {
    his = await ProductRequest.find({ orgId: user.orgId })
      .populate({
        path: "userId",
        model: "User",
        select: "-_id -email -password -history -role -orgId -updatedAt",
      })
      .populate({
        path: "productId",
        model: "Products",
        select: "-_id -description -orgId -updatedAt",
      });

    if (his.length === 0) {
      return next(new HttpError("No History of Organization found", 422));
    }
  } catch (err: any) {
    return next(new HttpError(err.message, 500));
  }
  res.json({ history: his });
};
