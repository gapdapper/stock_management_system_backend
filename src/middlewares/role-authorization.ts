import ForbiddenError from "@/utils/errors/forbidden-error";
import type { Request, Response, NextFunction } from "express";

export const authorizeUser = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).user || (req as any).user.role != "admin") {
    throw new ForbiddenError({
      code: 403,
      message: "Admin privilege required",
      logging: true,
    });
  }

  next()
};
