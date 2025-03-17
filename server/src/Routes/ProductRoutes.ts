import { Router } from "express";
import { createProduct, getProductById } from "../controllers";
import { check } from "express-validator";

const router: Router = Router();

router.post(
  "/create",
  [
    check("name").not().isEmpty(),
    check("quantity").isNumeric({ no_symbols: true }).not().isEmpty(),
    check("description").not().isEmpty(),
    check("orgId").not().isEmpty(),
    check("category").not().isEmpty(),
    check("_id").not().isEmpty(),
    check("role").not().isEmpty(),
  ],
  createProduct
);

router.get("/:id", getProductById);

export default router;
