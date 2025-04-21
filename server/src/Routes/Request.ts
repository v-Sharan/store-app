import { Router } from "express";
import { checkToken } from "../middleware/JWTAuth";
import {
  CreateRequest,
  getHistory,
  getOrgHistory,
  QueryRequest,
  updateStatus,
} from "../controllers";
import { check, query } from "express-validator";

const router = Router();

//@ts-ignore
router.use(checkToken);

router.post(
  "/",
  [check("productId").not().isEmpty(), check("quantity").not().isEmpty()],
  CreateRequest
);

router.get("/orghistory", getOrgHistory);

router.get("/history", getHistory);

router.patch(
  "/",
  [query("productId").exists().isString(), query("status").exists().isString()],
  updateStatus
);

router.get("/", [query("category").exists().isString()], QueryRequest);

export default router;
