import { Router } from "express";
import * as spireSvc from "../services/spire/Spire";

const spire = new spireSvc.Spire();

export const spireRouter = Router();

export const createFailureMessage = (message: string, error: string) => {
    return { message, error };
};

/**
 * Spec for the route /arrConfigs
@openapi
/arrConfigs:
    get:
      tags:
        - spire
      summary: Returns an of all available ARR configs
      responses:
        200:
          description: An array of all available ARR configs
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Section"
*/
spireRouter.get("/arrConfigs", (req, res, next) => {
    res.json(spire.getArrConfigs());
});

/**
 * Spec for the route /subjects
@openapi
   /subjects:
    get:
      tags:
        - spire
      summary: Returns an array of all subjects
      responses:
        200:
          description: array of all subjects
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Subject"
 */
spireRouter.get("/subjects", (req, res, next) => {
    res.json(spire.getSubjects());
});

/**
@openapi
/courses:
get:
  tags:
    - spire
  parameters:
    - name: subjectId
      in: query
      description: The subject id to get courses for
      required: true
      schema:
        type: string
  summary: Returns an array of all courses for `subjectId`
  responses:
    200:
      description: Returns an array of all courses for `subjectId`
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: "#/components/schemas/Course"
    400:
      description: Bad Request
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/FailureMessage"
*/
spireRouter.get("/courses", (req, res, next) => {
    const subjectId = req.query.subjectId as string;
    if (!subjectId) {
        res.status(400).json(
            createFailureMessage("Bad Request", "Missing subjectId"),
        );
        return;
    }
    if (!spire.isValidSubjectId(subjectId)) {
        res.status(400).json(
            createFailureMessage("Bad Request", "Invalid subjectId"),
        );
        return;
    }
    res.json(spire.getCoursesBySubjectId(subjectId));
});

/**
@openapi
  /semesterStrings:
    get:
      tags:
        - spire
      summary: Returns an array of all semester strings objects
      responses:
        200:
          description: an array of all semester strings
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    display:
                      type: string
                      example: "Spring 2022"
                    value:
                      type: string
                      example: "spring-2022"
*/
spireRouter.get("/semesterStrings", (req, res, next) => {
    res.json(spire.getPastSemesterStrings());
});

/**
@openapi
  /gradeOptions:
    get:
      tags:
        - spire
      summary: Returns an array of all grade options
      responses:
        200:
          description: an array of grade options
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
                  example:
                    - A
                    - A-
                    - B
                    - B+
 */
spireRouter.get("/gradeOptions", (req, res, next) => {
    res.json(spire.getGradeOptions());
});
