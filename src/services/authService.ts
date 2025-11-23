import bcrypt from 'bcryptjs';
import authRepository from '@/repositories/authRepository';
import BadRequestError from '@/utils/errors/bad-request';
import jwt, { type SignOptions } from 'jsonwebtoken';
import UnauthorizedError from '@/utils/errors/unauthorized';

export const registerUser = async (user: any): Promise<{ id: number }> => {
        const isUsernameExist = await authRepository.findUserByUsername(user.username);
      
        if (isUsernameExist) {
          throw new BadRequestError({
            code: 400,
            message: "Username already exists!",
            logging: true,
          });
        }
      
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await authRepository.addUser({ ...user, password: hashedPassword });
        return newUser;
};

export const loginUser = async (credentials: { username: string; password: string }): Promise<{ accessToken: string; refreshToken: string }> => {
  const user = await authRepository.findUserByUsername(credentials.username);
  if (!user || !user.id) {
    throw new BadRequestError({
      code: 400,
      message: "Invalid username or password!",
      logging: true,
    });
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
  if (!isPasswordValid) {
    throw new BadRequestError({
      code: 400,
      message: "Invalid username or password!",
      logging: true,
    });
  }

  const accessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION } as SignOptions
  )

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION } as SignOptions
  );

  await authRepository.storeRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken  };
}

export const logoutUser = async (refreshToken: string): Promise<void> => {
  await authRepository.removeRefreshToken(refreshToken);
}

export const refreshToken = async (userId: number, refreshToken: string): Promise<string> => {
  const user = await authRepository.findUserById(userId);

  if (!user || !user.id) {
    throw new UnauthorizedError({
      code: 401,
      message: "User not found!",
      logging: true,
    });
  }

  if (user.refreshToken !== refreshToken) {
    return Promise.reject(new UnauthorizedError({
      code: 401,
      message: "Invalid refresh token!",
      logging: true,
    }));
  }

  const newAccessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION } as SignOptions
  )

  return newAccessToken;
}


export default {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
};