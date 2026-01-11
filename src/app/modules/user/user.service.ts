import httpStatus from 'http-status-codes';
import { IUser, Role } from "./user.interface";
import bcryptjs from "bcryptjs";
import AppError from '../../errorHelpers/appError';
import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import { User } from './user.model';

const createUserService = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isExistUser = await User.findOne({ email })

    if (isExistUser) {
        throw new AppError(httpStatus.CONFLICT, "User already exist")
    }

    const hashPassword = await bcryptjs.hash(password as string, 10)
    const user = await User.create({
        email,
        password: hashPassword,
        ...rest
    })

     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const { password:hashedPass, ...userWithoutPassword } = user.toObject();
    
    return userWithoutPassword;

}

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};

const getSingleUser = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
    return {
        data: user
    }
};

const deleteUser = async (id: string) => {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }
     
    await User.findByIdAndDelete(id);
    
    return {
        data: null
    }
};

const updateUser = async (
    userId: string,
    payload: Partial<IUser>,
    decodedToken: JwtPayload
) => {
    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Editor Role Restrictions
    if (decodedToken.role === Role.USER) {
        if (userId !== decodedToken.userId) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized to update this user.");
        }

        if (payload.role)  {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to modify these fields.");
        }
    }

    if (payload.password) {
        const hashedPassword = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
        payload.password = hashedPassword;
    }

    // No restrictions for Admin — directly update
    const updatedUser = await User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });

    return updatedUser;
};

export const UserServices = {
    createUserService,
    getMe,
    getSingleUser,
    deleteUser,
    updateUser
}
