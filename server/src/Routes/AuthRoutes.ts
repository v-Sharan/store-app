import {Router} from "express";
import {OrgUserAuth} from '../controllers'
import {check} from 'express-validator'

const router: Router = Router();

router.post("/org", [
    check("orgname").not().isEmpty(),
    check("email").isEmail(),
    check("password").not().isEmpty(),
], OrgUserAuth);

export default router;