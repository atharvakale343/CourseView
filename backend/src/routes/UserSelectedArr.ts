import { NextFunction, Router } from "express";
import { Request, Response } from "express";
import { checkAuthorization } from "../middlewares/authCheck";
import createHttpError from "http-errors";

export const userSelectedArr = Router();

/**
@openapi
/userSelectedArrConfig:
    get:
    tags:
    - user
    security:
    - cookieAuth: []
    summary: Get the user selected ARR Configs
    responses:
    200:
        description: Array of user selected ARR Config ids
        content:
        application/json:
            schema:
            $ref: "#/components/schemas/UserSelectedArrConfigs"
*/
userSelectedArr.get(
    "/userSelectedArrConfig",
    checkAuthorization,
    (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        // TODO
        next(createHttpError(501, "Not Implemented"));
    },
);

/**
@openapi
/userSelectedArrConfig:
    put:
    tags:
        - user
    security:
        - cookieAuth: []
    summary: Save the user selected ARR Configs
    requestBody:
        description: The user selected arr configs. These the same string as `id` in Section
        required: true
        content:
        application/json:
            schema:
            $ref: "#/components/schemas/UserSelectedArrConfigs"
    responses:
        200:
        description: Added successfully
        content:
            application/json:
            schema:
                $ref: "#/components/schemas/SuccessMessage"
        400:
        description: Bad Request
        content:
            application/json:
            schema:
                $ref: "#/components/schemas/FailureMessage"
        401:
        description: Unauthorized
        content:
            application/json:
            schema:
                $ref: "#/components/schemas/FailureMessage"
 */
userSelectedArr.put(
    "/userSelectedArrConfig",
    checkAuthorization,
    (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        // TODO
        next(createHttpError(501, "Not Implemented"));
    },
);
