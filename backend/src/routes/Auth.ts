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
        console.log("req.protocol", req.protocol);
        console.log("req.hostname", req.hostname);
        console.log("req.ip", req.ip);
        console.log("req.ips", req.ips);
        res.json({ user: req.user });
    },
);

authRouter.get("/loggedIn", controller.loggedIn);

authRouter.post("/logout", controller.logout);
