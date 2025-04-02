import express, { Router } from "express";
import {
  createProduct,
  getProductById,
  getProductByOrgId,
  deleteProduct,
  CreateRequest,
} from "../controllers";
import { check } from "express-validator";
import { checkToken } from "../middleware/JWTAuth";
import { fileUpload } from "../middleware/fileupload";
import path from "path";

const router: Router = Router();

// @ts-ignore
router.use(checkToken);

router.use("/uploads", express.static(path.join("uploads")));

router.post(
  "/create",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("quantity").isNumeric({ no_symbols: true }).not().isEmpty(),
    check("description").not().isEmpty(),
    check("orgId").not().isEmpty(),
    check("category").not().isEmpty(),
  ],
  createProduct
);

router.get("/:id", getProductById);

router.get("/orgId/:id", getProductByOrgId);

router.delete("/:id", deleteProduct);

router.post(
  "/request",
  [
    check("userId").not().isEmpty(),
    check("productId").not().isEmpty(),
    check("quantity").not().isEmpty(),
  ],
  CreateRequest
);

export default router;
