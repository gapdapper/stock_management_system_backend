import * as authRepository from "@/repositories/authRepository";
import BadRequestError from "@/utils/errors/bad-request";

export const getUser = async (userId: number) => {
    const user = await authRepository.findUserById(userId);
    if (!user) {
        throw new BadRequestError({
            code: 400,
            message: "User not found",
            logging: true,
        });
    }
    return user;
}
