import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { logger } from "../utils/logger";

declare type WebError = Error & { status?: number };
export const errorHandler = (
    err: WebError,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    logger.error(err.message);
    res.json({
        message: err.message,
        error: err,
    });
};

export const errorNotFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    next(createError(404));
};
