import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {OrgUser as RootUser} from "../schema/organizationUser.schema"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {HttpError} from "../utils/HttpError";

export const OrgUserAuth = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }
    const {orgname, email, password} = req.body;
    const jwtToken: string = jwt.sign({email, orgname}, process.env.JWT_TOKEN!, {
        expiresIn: "90h",
    });
    try {
        let existingUser;

        try {
            existingUser = await RootUser.findOne({email: email});
        } catch (err) {
            const error = new HttpError(
                "Signing up failed, please again later.",
                500
            );
            return next(error);
        }
        if (existingUser) {
            const error = new HttpError(
                "user Already exist, instead of signing,click login",
                201
            );
            return next(error);
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            const createdUser = new RootUser({
                orgname,
                // orgId,
                email,
                password:hash,
                users: [],
            });

            const userLogged = {
                id: createdUser._id,
                username: createdUser.orgname,
            };
            try {
                await createdUser.save();
                res.json({user: userLogged, token: jwtToken});
            } catch (err) {
                const error = new HttpError("Signing in failed, try again later", 201);
                return next(error);
            }
        }
    } catch (error: any) {
        return next(new HttpError(error?.message, 422));
    }
}

export const UserWithOrg = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }
}