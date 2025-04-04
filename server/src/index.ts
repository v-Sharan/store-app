import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { ConnectDB } from "./connection";

import { RootUserAuthRoutes, UserAuthRoutes, ProductsRoutes } from "./Routes";

dotenv.config();

const app: Express = express();
const url: string = process.env.MONGODB_URL!;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static(path.join("uploads")));

app.use("/auth/org", RootUserAuthRoutes);
app.use("/auth/user", UserAuthRoutes);

app.use("/products", ProductsRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Express.js application with Store Database");
});

// app.use((error: any, req: Request, res: Response, next: NextFunction) => {
//   if (req.file) {
//     fs.unlink(req.file.path, () => {
//       console.log(error);
//     });
//   }
//   const status = error.status || 500;
//   const message = error.message || "Something went wrong.";
//   res.status(status).json({ message: message });
// });

const StartServer = () => {
  try {
    ConnectDB(url);
    app.listen(8001, () => {
      console.log("Server listening on 8001");
    });
  } catch (err) {
    console.error(err);
  }
};

StartServer();
