import { userService } from "@/features/user/services/user.service";

export class AuthService {
  // Methods for authentication will go here.
  // Likely strictly relying on Better Auth's client/server SDKs.
  // But we might need helper methods like 'getCurrentUser' wrapping the session check.
  
  async validateUser(email: string) {
      return userService.getUserByEmail(email);
  }
}

export const authService = new AuthService();
