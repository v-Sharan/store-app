import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import {HttpError} from "../utils/HttpError";
import {generateCode, generateCodeForUsers} from '../utils/generateId'

import {OrgUser as RootUser} from "../schema/organizationUser.schema"
import {User} from "../schema/user.shema";

const salt = bcrypt.genSaltSync(10);

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
            const hash = bcrypt.hashSync(password, salt);

            const id = generateCode()

            const createdUser = new RootUser({
                orgname,
                orgId:id,
                email,
                password:hash,
                users: [],
            });

            const userLogged = {
                id: createdUser._id,
                username: createdUser.orgname,
                orgId: createdUser.orgId,
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

export const LoginRootUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }
    const {orgId,password} = req.body
    let user;
    try {
        user = await RootUser.findOne({ orgId });
    } catch (err) {
        const error = new HttpError("Log in failed, please try again later.", 500);
        return next(error);
    }
    if (!user) {
        const error = new HttpError("User does't exist,Please sign in first", 402);
        return next(error);
    }
    const jwtToken = jwt.sign({ email:user.email,orgname:user.orgname }, process.env.JWT_TOKEN!, {
        expiresIn: "90h",
    });
    // @ts-ignore
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (user.orgId === orgId && isPasswordValid) {
        const userLoged = {
            id: user._id,
            username: user.orgname,
            createdAt: user.createdAt,
        };
        res.json({ user: userLoged, token: jwtToken });
    } else {
        return next(new HttpError("Credentials seems to be wrong", 500));
    }
}

export const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        );
    }
    const {orgId, email, password,role,username} = req.body;
    let user,existingRootUser;
    try{
        existingRootUser = await RootUser.findOne({orgId: orgId})
        if(!existingRootUser) {
            return next(
                new HttpError("Root User is not exist.", 422)
            )
        }
        user = await User.findOne({email})
        if (user) {
            const error = new HttpError(
                "user Already exist, insted of signin,click login",
                201
            );
            return next(error);
        } else{
            const hash = bcrypt.hashSync(password, salt);
            const newUser = new User({
                orgId,
                userId:generateCodeForUsers(),
                password:hash,
                email,
                role,
                username,
                history:[],
            });

            const userLoged = {
                id: newUser._id,
                username: newUser.username,
                createdAt: newUser.createdAt,
            };
            const jwtToken: string = jwt.sign({email}, process.env.JWT_TOKEN!, {
                expiresIn: "90h",
            });

            try{
                const responseOfUpdate = await existingRootUser.updateOne({users: [...existingRootUser.users, newUser._id]})
                if(!responseOfUpdate.acknowledged) {
                    return next(
                        new HttpError("Register User Via RootUser Failed.", 422)
                    )
                }
                await newUser.save()
                res.json({user: userLoged,token:jwtToken});
            } catch (e:any) {
                return next(
                    new HttpError("Something went wrong while creating user.Come back later!.", 422)
                )
            }
        }
    } catch(err:any){
        return next(
            new HttpError("Signing up failed, please again later", 500)
        )
    }
}

export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError("Invalid inputs passed, please check your data.", 422)
        )
    }
    const {userId,password} = req.body;
    try{
        const user = await User.findOne({userId })
        if (!user) {
            return next(
                new HttpError(`No User found in this id ${userId}`, 422)
            )
        }
        // @ts-ignore
        const isPasswordValid = bcrypt.compareSync(password, user.password);

        if(!isPasswordValid) {
            return next(
                new HttpError("Password is incorrect", 400)
            )
        }
        const jwtToken: string = jwt.sign({userId}, process.env.JWT_TOKEN!, {
            expiresIn: "90h",
        });
        res.json({user:{id:user._id,username:user.username,orgId:user.orgId},token:jwtToken});
    }catch(err:any){
        return next(
            new HttpError("Something went wrong while login user! try sometimes later.", 422)
        )
    }
}