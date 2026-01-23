import { userRepository } from "../repositories/user.repository";
import { Prisma } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

export class UserService {
  async getAllUsers() {
    return userRepository.findAll();
  }

  async getUserById(id: string) {
    return userRepository.findById(id);
  }

  async getUserByEmail(email: string) {
    return userRepository.findByEmail(email);
  }

  async createUser(data: Prisma.UserCreateInput & { password?: string }) {
    let accountData = undefined;
    
    if (data.password) {
      const hashedPassword = await hashPassword(data.password);
      accountData = {
        create: {
          id: crypto.randomUUID(),
          accountId: crypto.randomUUID(),
          providerId: "credential",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = data;

    const prismaData: Prisma.UserCreateInput = {
      ...userData,
      accounts: accountData,
    };

    return userRepository.create(prismaData);
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput & { password?: string }) {
    if (data.password) {
      const hashedPassword = await hashPassword(data.password);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userData } = data;

      return userRepository.update(id, {
        ...userData,
        accounts: {
          updateMany: {
            where: { providerId: "credential" },
            data: { password: hashedPassword },
          },
        },
      });
    }
    return userRepository.update(id, data);
  }

  async deleteUser(id: string) {
    return userRepository.delete(id);
  }
}

export const userService = new UserService();
