import { Request, Response } from "express";

export const getAccountDetails = (req: Request, res: Response) => {
    res.send("Account details");
};

export const saveAccountDetails = (req: Request, res: Response) => {
    res.send("Account details saved");
};
