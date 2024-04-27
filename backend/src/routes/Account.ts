import { Router } from "express";
import * as controller from "../controllers/Account";

export const accountRouter = Router();

accountRouter.get("/getAccountDetails", controller.getAccountDetails);

accountRouter.post("/saveAccountDetails", controller.saveAccountDetails);
