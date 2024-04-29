import { Router } from "express";
import { checkAuthorization } from "../middlewares/authCheck";
import createHttpError from "http-errors";

export const accountRouter = Router();

/**
@openapi
  /getAccountDetails:
    get:
      security:
        - cookieAuth: []
      tags:
        - account
      summary: Gets the user related information to show in My Account
      responses:
        200:
          description: Account info
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Account"
        401:
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/FailureMessage"
*/
accountRouter.get(
    "/getAccountDetails",
    checkAuthorization,
    (req, res, next) => {
        const user = req.user;
        // TODO
        next(createHttpError(501, "Not Implemented"));
    },
);

/**
@openapi
  /saveAccountDetails:
    post:
      security:
        - cookieAuth: []
      tags:
        - account
      summary: Save the user related information shown in My Account
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/Account"
      responses:
        200:
          description: Saved successfully
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
accountRouter.post(
    "/saveAccountDetails",
    checkAuthorization,
    (req, res, next) => {
        const user = req.user;
        // TODO
        next(createHttpError(501, "Not Implemented"));
    },
);
