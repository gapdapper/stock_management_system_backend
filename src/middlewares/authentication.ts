import UnauthorizedError from "@/utils/errors/unauthorized";
import type { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken"

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new UnauthorizedError({
        code: 401,
        message: "Access token is missing",
      })
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(
      new UnauthorizedError({
        code: 401,
        message: "Access token is missing",
      })
    );
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { sub: string, role: string };

    (req as any).user = { id: decodedToken.sub, role: decodedToken.role };
    next();
  } catch (error) {
    next(new UnauthorizedError({
      code: 401,
      message: "Invalid or expired access token",
    }) );
  }
};

// export const refreshTokenValidation = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const refreshToken = req.cookies.refreshToken;
//     if (!refreshToken) {
//         throw new UnauthorizedError({
//             code: 401,
//             message: "Refresh token is missing",
//             logging: true,
//         });
//     }

//     try {
//         const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { userId: string };        
//         (req as any).userId = decodedToken.userId;
//         next();
//     } catch (error) {
//         next(new UnauthorizedError({
//             code: 401,
//             message: "Invalid or expired refresh token",
//             logging: true,
//         }) );
//     }
// }