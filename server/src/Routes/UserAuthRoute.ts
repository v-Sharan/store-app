import { Router } from "express";
import { CreateUser, LoginUser } from "../controllers";
import { check } from "express-validator";
import { checkToken } from "../middleware/JWTAuth";

const router: Router = Router();

router.post(
  "/register",
  [
    check("orgId").not().isEmpty(),
    check("email").isEmail(),
    check("password").not().isEmpty(),
    check("role").not().isEmpty(),
    check("username").not().isEmpty(),
  ],
  CreateUser
);

router.post(
  "/login",
  [check("email").not().isEmpty(), check("password").not().isEmpty()],
  LoginUser
);

//@ts-ignore
router.use(checkToken);

export default router;
