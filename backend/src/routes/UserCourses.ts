import { Router } from "express";
import { checkAuthorization } from "../middlewares/authCheck";
import createHttpError from "http-errors";
import { courseDB } from "../config/db";
import { UserCourse } from "@client/lib/types/course";

interface UserDocument {
    _id: string;
    courses: UserCourse[]; // Assuming courses are represented as strings
    // Add other properties as needed
}

// userDB has two fields : id which is the user email and courses which is an array of courses taken by the user

export const userCourses = Router();

// Function to create document in userDB that maps user email to courses taken by user

userCourses.post(
    "/registerUserCourse",
    checkAuthorization,
    (req, res, next) => {
        const user = req.user;
        const user_email = user.email;

        // Check if the user is already registered
        courseDB
            .get(user_email)
            .then(doc => {
                // User is already registered
                res.status(200).json({ message: "User is already registered" });
            })
            .catch(err => {
                if (err.name === "not_found") {
                    // User is not registered, register the user
                    courseDB
                        .put({
                            _id: user_email,
                            courses: [],
                        })
                        .then(response => {
                            res.status(200).json({
                                message: "User registered successfully",
                            });
                        })
                        .catch(err => {
                            next(createHttpError(500, "Internal Server Error"));
                        });
                } else {
                    // Handle other errors
                    next(createHttpError(500, "Internal Server Error"));
                }
            });
    },
);

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

    courseDB
        .get<UserDocument>(user_email)
        .then(doc => {
            // User document found, return courses
            res.status(200).json(doc.courses);
        })
        .catch(err => {
            if (err.name === "not_found") {
                // User document not found, user is not registered
                res.status(404).json({ message: "User is not registered" });
            } else if (err.name === "unauthorized") {
                // Unauthorized error, user is not authorized
                res.status(401).json({
                    message: "fail",
                    error: "Unauthorized",
                });
            } else {
                next(createHttpError(500, "Internal Server Error"));
            }
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

    courseDB
        .get<UserDocument>(user_email)
        .then(doc => {
            if (
                doc.courses
                    .map(uc => uc.course.id)
                    .includes(userCourse.course.id)
            ) {
                // Course already exists
                throw new Error("Course already exists");
            }
            doc.courses.push(userCourse);
            return courseDB.put(doc);
        })
        .then(response => {
            // Course added successfully
            res.status(200).json({ message: "success" });
        })
        .catch(err => {
            if (err.name === "not_found") {
                // User document not found, user is not registered
                res.status(404).json({
                    message: "fail",
                    error: "User is not registered",
                });
            } else {
                // Other errors
                res.status(400).json({ message: "fail", error: err.message });
            }
        });
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

    courseDB
        .get<UserDocument>(user_email)
        .then(doc => {
            // iterate through the courses and delete the course if the course_id matches
            const courses = doc.courses;
            let courseDeleted = false;
            console.log(courses);
            for (let i = 0; i < courses.length; i++) {
                if (courses[i].course.id === course_id) {
                    courses.splice(i, 1);
                    courseDeleted = true;
                    break;
                }
            }

            if (!courseDeleted) {
                // Course with the given ID not found
                res.status(400).json({
                    message: "fail",
                    error: "Course not found",
                });
                return;
            }
            return courseDB.put(doc);
        })
        .then(response => {
            // Course deleted successfully
            res.status(200).json({ message: "success", detail: response });
        })
        .catch(err => {
            if (err.name === "not_found") {
                // User document not found, user is not registered
                res.status(404).json({
                    message: "fail",
                    error: "User is not registered",
                });
            } else if (err.name === "unauthorized") {
                // Unauthorized error, user is not authorized
                res.status(401).json({
                    message: "fail",
                    error: "Unauthorized",
                });
            } else {
                // Other errors
                res.status(500).json({ message: "fail", error: err });
            }
        });
});
