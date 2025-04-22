import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";

import { HttpError } from "../utils/HttpError";
import { Products } from "../schema/product.schema";
import { cloudinary } from "../utils/cloudinary";
import { Readable } from "stream";
import { type UploadApiResponse } from "cloudinary";
import { AuthRequest } from "../middleware/JWTAuth";

const streamUpload = (
  buffer: Express.Multer.File["buffer"]
): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "store" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    // Create readable stream from buffer (binary)
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null); // signal end of stream
    readable.pipe(stream);
  });

export const createProduct = async (
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
  const { name, quantity, description, orgId, category } = req.body;
  let createProduct;
  try {
    const buffer = req.file?.buffer;
    // @ts-ignore
    const result = await streamUpload(buffer);
    createProduct = new Products({
      orgId,
      name,
      quantity,
      description,
      category,
      url: result.secure_url,
    });
    await createProduct.save();
  } catch (err: any) {
    const error = new HttpError(`Something went wrong!. ${err?.message}`, 500);
    return next(error);
  }
  res.json({ message: "Created Successfully" });
  // res.json({ message: "Created Successfully", productId: createProduct._id });
};

export const getProductById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  let prod;
  try {
    prod = await Products.findById(id);
  } catch (err: any) {
    const error = new HttpError(
      `Something went wrong while retive the data of product ${id}!. ${err?.message}`,
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
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let prods;
  const user = req.user;
  try {
    prods = await Products.find({ orgId: user.orgId });
    if (prods.length === 0) {
      const error = new HttpError("Product list is empty", 402);
      return next(error);
    }
    res.json({ Products: prods });
  } catch (err: any) {
    const error = new HttpError(
      `Something went wrong while retive the data of products!. ${err?.message}`,
      500
    );
    return next(error);
  }
};

export const deleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const prod = await Products.findByIdAndDelete(id);
    if (!prod) {
      const error = new HttpError("Product not found", 404);
      return next(error);
    }
    res.json({ message: "Deleted Product Successfully" });
  } catch (e: any) {
    const error = new HttpError(`${e?.message}`, 422);
    return next(error);
  }
};

export const QueryRequest = async (
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
  const { category } = req.query;
  let prods;
  try {
    prods = await Products.find({ category, orgId: req.user?.orgId });
    if (prods.length === 0) {
      return next(new HttpError(`No Product Found in this ${category}`, 500));
    }
    res.json({ products: prods }).status(200);
  } catch (err: any) {
    const error = new HttpError(`Something went wrong!.`, 422);
    return next(error);
  }
};

export const updateProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {};
