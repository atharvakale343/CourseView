import { Router } from "express";
import { checkAuthorization } from "../middlewares/authCheck";
import createHttpError from "http-errors";
import { userDB } from "../config/db";

export const userCourses = Router();

/**
@openapi
  /userCourse:
    get:
      tags:
        - user
      security:
        - cookieAuth: []
      summary: Returns an array of user courses
      responses:
        200:
          description: an array of user courses
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/UserCourse"
        401:
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/FailureMessage"
 */
userCourses.get("/userCourse", checkAuthorization, (req, res, next) => {
    const user = req.user;
    // TODO

    next(createHttpError(501, "Not Implemented"));
});

/**
@openapi
  /userCourse:
    post:
      tags:
        - user
      security:
        - cookieAuth: []
      summary: Add a user course
      requestBody:
        description: the user course
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/UserCourse"
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
userCourses.post("/userCourse", checkAuthorization, (req, res, next) => {
    const user = req.user;
    // TODO
    next(createHttpError(501, "Not Implemented"));
});

/**
@openapi
  /userCourse:
    delete:
      tags:
        - user
      security:
        - cookieAuth: []
      summary: Delete a user course
      parameters:
        - name: courseId
          in: query
          required: true
          schema:
            type: string
            example: COMPSCI|187
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
userCourses.delete("/userCourse", checkAuthorization, (req, res, next) => {
    const user = req.user;
    // TODO
    next(createHttpError(501, "Not Implemented"));
});
