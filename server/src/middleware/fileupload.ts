import multer from "multer";

export const fileUpload: multer.Multer = multer({
  storage: multer.memoryStorage(),
});
