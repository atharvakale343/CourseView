import { NextFunction, Router } from "express";
import { Request, Response } from "express";
import { checkAuthorization } from "../middlewares/authCheck";
import { preferenceDB } from "../db/pouchdbSetup";
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
userSelectedArr.get("/userSelectedArrConfig", checkAuthorization, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const data: any = await preferenceDB.get(user.email); 
        res.status(200).json(data.preferences);
    }
    catch (err: unknown) {
        next(err)
    }
});

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
userSelectedArr.put("/userSelectedArrConfig", checkAuthorization, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const data = await preferenceDB.put({ _id: user.email, preferences: req.body}); 
        res.status(200).json(data);
    }
    catch (err: unknown) {
        next(err)
    }
});
