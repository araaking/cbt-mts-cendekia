import { testRepository } from "../repositories/test.repository";
import { Prisma } from "@prisma/client";

export class TestService {
  async getAllTests(includeInactive = false) {
    return testRepository.findAll(includeInactive);
  }

  async getTestById(id: string) {
    return testRepository.findById(id);
  }

  async createTest(data: Prisma.TestCreateInput) {
    // Validate dates
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      throw new Error("Start date cannot be after end date");
    }
    return testRepository.create(data);
  }

  async updateTest(id: string, data: Prisma.TestUpdateInput) {
    // Validate dates if both are present in update
    // Note: This is a simple check, a robust one would check against existing DB values if only one is updated
    if (data.startDate && data.endDate && typeof data.startDate === 'object' && typeof data.endDate === 'object') {
       // @ts-ignore - Prisma types for dates can be complex (Date | string | FieldUpdateOperationsInput)
       if (data.startDate > data.endDate) {
         throw new Error("Start date cannot be after end date");
       }
    }
    return testRepository.update(id, data);
  }

  async deleteTest(id: string) {
    return testRepository.delete(id);
  }

  async getAvailableTests() {
    return testRepository.getActiveTests();
  }
}

export const testService = new TestService();
