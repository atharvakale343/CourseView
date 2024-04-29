import { Router } from "express";
import { checkAuthorization } from "../middlewares/authCheck";
import createHttpError from "http-errors";

export const userAssignments = Router();

/**
@openapi
  /userAssignment:
    get:
      tags:
        - user
      security:
        - cookieAuth: []
      summary: Returns an array of user course assignments
      responses:
        200:
          description: an array of user course assignments
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/DegreeRequirementAssignment"
        401:
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/FailureMessage"
 */
userAssignments.get("/userAssignment", checkAuthorization, (req, res, next) => {
    const user = req.user;
    // TODO
next(createHttpError(501, "Not Implemented"));
});

/**
@openapi
/userAssignment:
    post:
      tags:
        - user
      security:
        - cookieAuth: []
      summary: Add a user course assignment
      requestBody:
        description: the user course assignment
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/DegreeRequirementAssignment"
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
userAssignments.post("/userAssignment", checkAuthorization, (req, res, next) => {
    // TODO
next(createHttpError(501, "Not Implemented"));
    const user = req.user;
});

/**
@openapi
/userAssignment:
    delete:
      tags:
        - user
      security:
        - cookieAuth: []
      summary: Delete a user course assignment
      parameters:
        - name: assignmentId
          in: query
          required: true
          schema:
            type: string
            example: a random sequence of bytes as saved in the db
      responses:
        200:
          description: Deleted successfully
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
userAssignments.delete("/userAssignment", checkAuthorization, (req, res, next) => {
    const user = req.user;
    // TODO
next(createHttpError(501, "Not Implemented"));
});
