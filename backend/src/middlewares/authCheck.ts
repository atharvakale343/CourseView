import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

export const checkAuthorization = (
    req: Request,
    res: Response,
    next: NextFunction,
): any => {
    if (!req.user) {
        console.log("Unauthorized");
        next(createError(401));
    }
    next();
};
