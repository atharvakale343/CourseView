import { Router } from "express";
import * as controller from "../controllers/Auth";
import passport from "passport";

export const authRouter = Router();

authRouter.post(
    "/auth/one-tap/callback",
    passport.authenticate("google-one-tap"),
    function (req, res, next) {
        res.json({ user: req.user });
    },
);

authRouter.post(
    "/auth/basic/callback",
    passport.authenticate("local", { session: true }),
    function (req, res, next) {
        res.json({ user: req.user });
    },
);

authRouter.get("/loggedIn", controller.loggedIn);

authRouter.post("/logout", controller.logout);
