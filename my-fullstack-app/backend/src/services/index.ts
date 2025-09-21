// filepath: /my-fullstack-app/my-fullstack-app/backend/src/services/index.ts
import { UserModel } from '../models';
import { User } from '../types';

export const getUserById = async (id: string): Promise<User | null> => {
    const user = await UserModel.findById(id);
    return user;
};

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
    const newUser = await UserModel.create(userData);
    return newUser;
};

// Add more service functions as needed.