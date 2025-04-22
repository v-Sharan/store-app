import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProductByOrgId,
  deleteProduct,
  updateProduct,
} from "../controllers";
import { check } from "express-validator";
import { checkToken } from "../middleware/JWTAuth";
import { fileUpload } from "../middleware/fileupload";

const router: Router = Router();

// @ts-ignore
router.use(checkToken);

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

router.get("/orgId", getProductByOrgId);

router.get("/product/:id", getProductById);

router.patch(
  "/:id",
  [
    check("name").not().isEmpty(),
    check("quantity").isNumeric({ no_symbols: true }).not().isEmpty(),
    check("description").not().isEmpty(),
    check("category").not().isEmpty(),
  ],
  updateProduct
);

// router.delete("/:id", deleteProduct);

export default router;
