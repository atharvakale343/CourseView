import { Request, Response } from "express";

/**
 * GET /userCourses
 */
export const getUserCourses = async (
    req: Request,
    res: Response,
): Promise<void> => {
    res.json({ message: "Hello, World!" });
};
