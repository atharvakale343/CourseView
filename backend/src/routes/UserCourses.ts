import { Router } from "express";
import * as controller from "../controllers/UserCourses";

export const userCourses = Router();

userCourses.get("/userCourses", controller.getUserCourses);
