import { Router } from "express";
import { OrgUserAuth, LoginRootUser } from "../controllers";
import { check } from "express-validator";

const router: Router = Router();

router.post(
  "/register",
  [
    check("orgname").not().isEmpty(),
    check("email").isEmail(),
    check("password").not().isEmpty(),
  ],
  OrgUserAuth
);

router.post(
  "/login",
  [check("orgId").not().isEmpty(), check("password").not().isEmpty()],
  LoginRootUser
);

export default router;
