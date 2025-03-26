import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProductByOrgId,
  deleteProduct,
  CreateRequest,
} from "../controllers";
import { check } from "express-validator";
import { checkToken } from "../middleware/JWTAuth";

const router: Router = Router();

// @ts-ignore
// router.use(checkToken);

router.post(
  "/create",
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
