import * as crypto from "node:crypto";

export const generateCode = () =>{
    return crypto.randomBytes(3).toString("hex").slice(0, 5).toUpperCase();
}

export const generateCodeForUsers = () =>{
    return crypto.randomBytes(3).toString("hex").slice(0, 7).toUpperCase();
}