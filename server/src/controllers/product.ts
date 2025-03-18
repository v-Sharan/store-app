import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import { OrgUser as RootUser } from "../schema/organizationUser.schema";
import { User } from "../schema/user.shema";
import { HttpError } from "../utils/HttpError";
import { Products } from "../schema/product.schema";

export const createProduct = async (
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
  const { name, quantity, description, orgId, category, _id, role } = req.body;
  if (role === "user") {
    const error = new HttpError(
      "Only Admin or Member of store could able to create Products",
      500
    );
    return next(error);
  }
  let existingUser, createProduct;
  if (role === "admin") {
    try {
      existingUser = await RootUser.findById(_id);
    } catch (e: any) {
      return next(
        new HttpError("Something went Wrong While creating Product", 500)
      );
    }
  } else if (role === "store") {
    try {
      existingUser = await User.findById(_id);
    } catch (e: any) {
      return next(
        new HttpError("Something went Wrong While creating Product", 500)
      );
    }
  }
  if (!existingUser) {
    const error = new HttpError("There is no user in this user name", 500);
    return next(error);
  }

  try {
    createProduct = new Products({
      orgId,
      name,
      quantity,
      description,
      category,
      createdBy: existingUser._id,
    });
    await createProduct.save();
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
  res.json({ message: "Created Successfully", productId: createProduct._id });
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  let prod;
  try {
    prod = await Products.findById(id);
  } catch (err: any) {
    const error = new HttpError(
      `Something went wrong while retive the data of product ${id}`,
      400
    );
    return next(error);
  }
  if (!prod) {
    return next(new HttpError(`No Product listed in this id ${id}`, 500));
  }
  res.json({ product: prod });
};

export const getProductByOrgId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { orgId } = req.params;
  let prods;
  try {
    prods = await Products.find({ orgId });
    if (prods.length === 0) {
      const error = new HttpError("Product list is empty", 402);
      next(error);
    }
    res.json({ Products: prods });
  } catch (err: any) {
    const error = new HttpError(
      `Something went wrong while retive the data of product ${orgId}`,
      500
    );
    return next(error);
  }
};
