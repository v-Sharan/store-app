import jwt, { VerifyErrors, JwtPayload } from "jsonwebtoken";
import * as dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { OrgUser } from "../schema/organizationUser.schema";
import { User } from "../schema/user.shema";
import { validationResult } from "express-validator";
import { HttpError } from "../utils/HttpError";

dotenv.config();

export interface AuthRequest extends Request {
  user?: any;
}

export const checkToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  const secret = process.env.JWT_TOKEN!;
  //@ts-ignore
  const AuthToken: string =
    req.headers["authorization"] || req.headers["Authorization"] || "";

  if (!AuthToken || !AuthToken.startsWith("Bearer")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  token = AuthToken.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  jwt.verify(token, secret, async (err: VerifyErrors | null, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token." });
    }
    const { id, role }: { id: string; role: string } = decoded;
    let user;
    if (role == "admin") {
      try {
        user = await OrgUser.findById(id).select("-password");
        if (!user) {
          return res.status(401).json({ message: "User not found." });
        }
      } catch (err: any) {
        return res
          .status(500)
          .json({ message: `Internal server error. ${err.message}` });
      }
    } else if (role == "user" || "store") {
      user = await User.findById(id);
      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }
    }
    req.user = user;
    next();
  });
};

export const verifyJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("No Token is passed.", 422));
  }
  //@ts-ignore
  const token: string = req.body.token;

  const jwtToken: JwtPayload = jwt.decode(token) as JwtPayload;

  //@ts-ignore
  const expiryTime = jwtToken?.exp * 1000;
  const now = Date.now();

  res.status(200).json({ isValid: expiryTime > now });
};
