import { Router } from "express";
import { checkToken } from "../middleware/JWTAuth";
import {
  CreateRequest,
  getHistory,
  getOrgHistory,
  QueryRequest,
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

// TODO --> update Booking Request
// router.get("");

// router.patch(
//   "/",
//   [query("productId").exists().isString(), query("status").exists().isString()],
//   updateStatus
// );

router.get("/", QueryRequest);

export default router;
