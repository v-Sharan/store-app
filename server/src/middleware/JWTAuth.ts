import jwt, {VerifyErrors} from "jsonwebtoken";
import * as dotenv from "dotenv";
import {Request, Response, NextFunction} from "express";

dotenv.config();

interface AuthRequest extends Request {
    decoded?: any;
}

export const checkToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;
    const secret = process.env.JWT_TOKEN!;
    const AuthToken: string = req.headers["authorization"] || "";

    if (!AuthToken || !AuthToken.startsWith("Bearer")) {
        return res.status(401).json({message: "Unauthorized: No token provided"});
    }

    token = AuthToken.split(" ")[1];

    if (!token) {
        return res.status(401).json({message: "No token provided."});
    }

    jwt.verify(token, secret, (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            return res.status(401).json({message: "Invalid token."});
        }
        req.decoded = decoded;
        next();
    });
};