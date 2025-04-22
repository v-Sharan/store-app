import express, { Express, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import { ConnectDB } from "./connection";
import jobs from "./job";
import { check } from "express-validator";

import {
  RootUserAuthRoutes,
  UserAuthRoutes,
  ProductsRoutes,
  ProdRequest,
} from "./Routes";
import { verifyJWT } from "./middleware/JWTAuth";

dotenv.config();

const app: Express = express();
const url: string = process.env.MONGODB_URL!;

jobs.start();
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/verifyJWT", [check("token").not().isEmpty()], verifyJWT);

app.use("/auth/org", RootUserAuthRoutes);
app.use("/auth/user", UserAuthRoutes);

app.use("/products", ProductsRoutes);
app.use("/request", ProdRequest);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Express.js application with Store Database");
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

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
