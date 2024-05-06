import { Router } from "express";
import { checkAuthorization } from "../middlewares/authCheck";
import { getAccount, saveAccount } from "../db/dbCRUD";
import { Account } from "@client/lib/types/account";
import { Spire } from "../services/spire/Spire";

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
        getAccount(user.email)
            .catch(err => {
                if (err.name === "not_found") {
                    return saveAccount({
                        email: user.email,
                        gradSem: "",
                        majors: [],
                        minors: [],
                    }).then(() => {
                        return getAccount(user.email);
                    });
                } else {
                    return Promise.reject(err);
                }
            })
            .then(account => {
                res.json(account);
            })
            .catch(err => {
                res.status(500).json({ message: "fail", error: err });
            });
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
        const body = req.body as Account;
        const user = req.user;
        if (user.email !== body.email) {
            res.status(400).json({
                message: "fail",
                error: "Email mismatch",
                reason: `User email: ${user.email}, body email: ${body.email}`,
            });
            return;
        }
        const validSemesters = new Spire()
            .getPastSemesterStrings()
            .map(sem => sem.value)
            .concat([""]);
        if (validSemesters.indexOf(body.gradSem) === -1) {
            res.status(400).json({
                message: "fail",
                error: "Invalid semester",
            });
            return;
        }
        saveAccount(req.body)
            .then(msg => res.json(msg))
            .catch(err => {
                res.status(500).json({ message: "fail", error: err });
            });
    },
);
