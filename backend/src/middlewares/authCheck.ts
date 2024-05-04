import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import { logger } from "../utils/logger";

export const checkAuthorization = (
    req: Request,
    res: Response,
    next: NextFunction,
): any => {
    if (!req.user) {
        logger.info("Unauthorized");
        next(createError(401));
    }
    next();
};
