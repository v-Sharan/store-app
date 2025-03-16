import {Router} from "express";
import {CreateUser,LoginUser} from '../controllers'
import {check} from 'express-validator'

const router: Router = Router();

// orgId, email, password,role,username

router.post("/register", [
    check("orgId").not().isEmpty(),
    check("email").isEmail(),
    check("password").not().isEmpty(),
    check("role").not().isEmpty(),
    check("username").not().isEmpty()
], CreateUser);

router.post("/login", [
    check("userId").not().isEmpty(),
    check("password").not().isEmpty(),
], LoginUser);

export default router;