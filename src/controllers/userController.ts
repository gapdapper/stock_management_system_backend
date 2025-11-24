import type { Request, Response } from "express";
import * as userService from "@/services/userService";

export const getUser = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const user = await userService.getUser(userId);
    return res.status(200).json({ user });
}