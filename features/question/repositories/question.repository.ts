import { prisma } from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";

export class QuestionRepository {
  async findByTestId(testId: string) {
    return prisma.question.findMany({
      where: { testId },
      orderBy: { order: "asc" },
    });
  }

  async findById(id: string) {
    return prisma.question.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.QuestionCreateInput) {
    return prisma.question.create({
      data,
    });
  }

  async update(id: string, data: Prisma.QuestionUpdateInput) {
    return prisma.question.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.question.delete({
      where: { id },
    });
  }

  async countByTestId(testId: string) {
    return prisma.question.count({
      where: { testId },
    });
  }
}

export const questionRepository = new QuestionRepository();
