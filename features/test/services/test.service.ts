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
    const getDateValue = (value: Prisma.TestUpdateInput["startDate"]) => {
      if (!value) return null;
      if (value instanceof Date) return value;
      if (typeof value === "string") return new Date(value);
      if (typeof value === "object" && "set" in value) {
        const setValue = value.set;
        if (setValue instanceof Date) return setValue;
        if (typeof setValue === "string") return new Date(setValue);
      }
      return null;
    };

    const startDate = getDateValue(data.startDate);
    const endDate = getDateValue(data.endDate);
    if (startDate && endDate && startDate > endDate) {
      throw new Error("Start date cannot be after end date");
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
