import { Router } from "express";
import { checkToken } from "../middleware/JWTAuth";
import { CreateRequest, getHistory, getOrgHistory } from "../controllers";
import { check } from "express-validator";

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

export default router;
