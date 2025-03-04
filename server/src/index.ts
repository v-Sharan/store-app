import express, {Express} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import {ConnectDB} from "./connection";

import {AuthRoutes} from "./Routes"

dotenv.config();

const app: Express = express();
const url = process.env.MONGODB_URL!;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/auth",AuthRoutes)

const StartServer = () => {
    try {
        ConnectDB(url)
        app.listen(8080, () => {
            console.log("Server listening on 8080");
        });
    } catch (err) {
        console.error(err);
    }
}

StartServer();