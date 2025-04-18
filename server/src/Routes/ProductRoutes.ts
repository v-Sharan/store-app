import { Router } from "express";
import {
  createProduct,
  getProductById,
  getProductByOrgId,
  deleteProduct,
  QueryRequest,
  updateStatus,
} from "../controllers";
import { check, query } from "express-validator";
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

router.get("/:id", getProductById);

router.get("/orgId/", getProductByOrgId);

router.delete("/:id", deleteProduct);

router.patch(
  "/",
  [query("requestId").exists().isString(), query("status").exists().isString()],
  updateStatus
);

router.get("/", [query("category").exists().isString()], QueryRequest);

export default router;
