import { Router } from "express";
import { checkAuthorization } from "../middlewares/authCheck";
import createHttpError from "http-errors";
import { courseDB } from "../db/pouchdbSetup";
import { UserCourse } from "@client/lib/types/course";
import {
    getDocumentByEmail,
    getStoredKeyByEmail,
    saveDocumentByEmail,
} from "../db/userPouchCRUD";
import { logger } from "../utils/logger";

// userDB has two fields : id which is the user email and courses which is an array of courses taken by the user

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
    const user_email = user.email;

    getStoredKeyByEmail<UserCourse[]>(user_email, "courses", courseDB)
        .then(userCourses => res.status(200).json(userCourses))
        .catch(err => {
            if (err.name === "not_found") {
                return saveDocumentByEmail(
                    user_email,
                    "courses",
                    [],
                    courseDB,
                ).then(() => res.status(200).json([]));
            } else {
                return Promise.reject(err);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "fail", error: err.message });
        });
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
    const userCourse = req.body as UserCourse;
    const user_email = user.email;

    logger.info(`Adding course ${JSON.stringify(userCourse)} to ${user_email}`);

    function addCourseToDoc(
        doc: {
            [key: string]: UserCourse[];
        } & PouchDB.Core.IdMeta &
            PouchDB.Core.GetMeta,
        userCourse: UserCourse,
    ) {
        if (
            doc.courses.map(uc => uc.course.id).includes(userCourse.course.id)
        ) {
            throw new Error("Course already exists");
        }
        doc.courses.push(userCourse);
    }

    getDocumentByEmail<UserCourse[]>(user_email, "courses", courseDB)
        // Error handling
        .catch(err => {
            // If the user document is not found, create a new user document
            if (err.name === "not_found") {
                // Create a new user document
                return (
                    saveDocumentByEmail(user_email, "courses", [], courseDB)
                        // Get the newly created user document
                        .then(() =>
                            getDocumentByEmail<UserCourse[]>(
                                user_email,
                                "courses",
                                courseDB,
                            ),
                        )
                );
            }
            // If the error is not a "not_found" error, reject the promise
            return Promise.reject(err);
        })
        // Add the course to the user document
        .then(doc => {
            addCourseToDoc(doc, userCourse);
            return courseDB.put(doc);
        })
        // Course added successfully
        .then(response =>
            res.status(200).json({ message: "success", detail: response }),
        )
        // Error handling
        .catch(err => next(err));
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
    const course_id = req.query.courseId as string;
    const user_email = user.email;

    getDocumentByEmail<UserCourse[]>(user_email, "courses", courseDB)
        // Check if the user email document exists, and create a new one if it doesn't
        .catch(err => {
            if (err.name === "not_found") {
                // User document not found, user is not registered
                return saveDocumentByEmail(
                    user_email,
                    "courses",
                    [],
                    courseDB,
                ).then(() =>
                    getDocumentByEmail<UserCourse[]>(
                        user_email,
                        "courses",
                        courseDB,
                    ),
                );
            }
            return Promise.reject(err);
        })
        // Check if the course exists in the user document
        .then(doc => {
            if (!doc.courses.map(uc => uc.course.id).includes(course_id)) {
                throw new createHttpError.BadRequest("Course not found");
            }
            doc.courses = doc.courses.filter(uc => uc.course.id !== course_id);
            return courseDB.put(doc);
        })
        .then(result =>
            res.status(200).json({ message: "success", detail: result }),
        )
        .catch(err => {
            next(err);
        });
});
