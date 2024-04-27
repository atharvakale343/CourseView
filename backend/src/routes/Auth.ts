import { Router } from "express";
import * as controller from "../controllers/Auth";
import passport from "passport";

export const authRouter = Router();

authRouter.post(
    "/auth/one-tap/callback",
    passport.authenticate("google-one-tap"),
    function (req, res) {
        console.log("req.cookie", req.cookies);
        console.log("callback req", req.isAuthenticated());
        res.json({ user: req.user });
    },
);

authRouter.get("/loggedIn", controller.loggedIn);

authRouter.post("/logout", controller.logout);
