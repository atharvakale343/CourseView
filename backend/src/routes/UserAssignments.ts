import { Router } from "express";
import { checkAuthorization } from "../middlewares/authCheck";
import createHttpError from "http-errors";
import {
    getDocumentByEmail,
    getStoredKeyByEmail,
    saveDocumentByEmail,
} from "../db/userPouchCRUD";
import { DegreeRequirementAssignment } from "@client/lib/types/Degree";
import { assignmentDB } from "../db/pouchdbSetup";

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
    const user_email = user.email;

    getStoredKeyByEmail<DegreeRequirementAssignment[]>(
        user_email,
        "userAssignments",
        assignmentDB,
    )
        .then(userAssignments => res.status(200).json(userAssignments))
        .catch(err => {
            if (err.name === "not_found") {
                return saveDocumentByEmail(
                    user_email,
                    "userAssignments",
                    [],
                    assignmentDB,
                ).then(() => res.status(200).json([]));
            } else {
                return Promise.reject(err);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "fail", error: err.message });
        });
});

function modifyUserAssignments(
    user_email: string,
    newAssignments: DegreeRequirementAssignment[],
    replace: boolean,
) {
    function addAssignmentToDoc(
        doc: {
            [key: string]: DegreeRequirementAssignment[];
        } & PouchDB.Core.IdMeta &
            PouchDB.Core.GetMeta,
        newAssignments: DegreeRequirementAssignment[],
    ) {
        const currentAssignmentIds = doc["userAssignments"].map(
            assign => assign.id,
        );
        const filteredAssignments = newAssignments.filter(assign => {
            return !currentAssignmentIds.includes(assign.id);
        });
        if (replace) {
            doc["userAssignments"] = newAssignments;
        } else {
            doc["userAssignments"].push(...filteredAssignments);
        }
    }

    return (
        getDocumentByEmail<DegreeRequirementAssignment[]>(
            user_email,
            "userAssignments",
            assignmentDB,
        )
            // Error handling
            .catch(err => {
                // If the user document is not found, create a new user document
                if (err.name === "not_found") {
                    // Create a new user document
                    return (
                        saveDocumentByEmail(
                            user_email,
                            "userAssignments",
                            [],
                            assignmentDB,
                        )
                            // Get the newly created user document
                            .then(() =>
                                getDocumentByEmail<
                                    DegreeRequirementAssignment[]
                                >(user_email, "userAssignments", assignmentDB),
                            )
                    );
                }
                // If the error is not a "not_found" error, reject the promise
                return Promise.reject(err);
            })
            // Add the course to the user document
            .then(doc => {
                addAssignmentToDoc(doc, newAssignments);
                return assignmentDB.put(doc);
            })
    );
}

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
userAssignments.post(
    "/userAssignment",
    checkAuthorization,
    (req, res, next) => {
        const user = req.user;
        const newAssignment = req.body as DegreeRequirementAssignment;
        const user_email = user.email;

        modifyUserAssignments(user_email, [newAssignment], false)
            // Course added successfully
            .then(response =>
                res.status(200).json({ message: "success", detail: response }),
            )
            // Error handling
            .catch(err => next(err));
    },
);

/**
@openapi
/userAssignment:
  put:
    tags:
      - user
    security:
      - cookieAuth: []
    summary: Put all user course assignments
    requestBody:
      description: the array user course assignments
      required: true
      content:
        application/json:
          schema:
            type: array
            items:
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
userAssignments.put("/userAssignment", checkAuthorization, (req, res, next) => {
    const user = req.user;
    const newAssignments = req.body as DegreeRequirementAssignment[];
    const user_email = user.email;

    modifyUserAssignments(user_email, newAssignments, true)
        // Course added successfully
        .then(response =>
            res.status(200).json({ message: "success", detail: response }),
        )
        // Error handling
        .catch(err => next(err));
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
userAssignments.delete(
    "/userAssignment",
    checkAuthorization,
    (req, res, next) => {
        const user = req.user;
        const assignmentId = req.query.assignmentId as string;
        const user_email = user.email;

        getDocumentByEmail<DegreeRequirementAssignment[]>(
            user_email,
            "userAssignments",
            assignmentDB,
        )
            // Check if the user email document exists, and create a new one if it doesn't
            .catch(err => {
                if (err.name === "not_found") {
                    // User document not found, user is not registered
                    return saveDocumentByEmail(
                        user_email,
                        "userAssignments",
                        [],
                        assignmentDB,
                    ).then(() =>
                        getDocumentByEmail<DegreeRequirementAssignment[]>(
                            user_email,
                            "userAssignments",
                            assignmentDB,
                        ),
                    );
                }
                return Promise.reject(err);
            })
            // Check if the course exists in the user document
            .then(doc => {
                if (
                    !doc["userAssignments"]
                        .map(assignment => assignment.id)
                        .includes(assignmentId)
                ) {
                    throw new createHttpError.BadRequest("Course not found");
                }
                doc["userAssignments"] = doc["userAssignments"].filter(
                    assignment => assignment.id !== assignmentId,
                );
                return assignmentDB.put(doc);
            })
            .then(result =>
                res.status(200).json({ message: "success", detail: result }),
            )
            .catch(err => {
                next(err);
            });
    },
);
