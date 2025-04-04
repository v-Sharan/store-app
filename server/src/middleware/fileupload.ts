import multer from "multer";

export const fileUpload = multer({ storage: multer.memoryStorage() });
