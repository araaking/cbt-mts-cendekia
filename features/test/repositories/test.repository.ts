import { prisma } from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";

export class TestRepository {
  async findAll(includeInactive = false) {
    if (includeInactive) {
      return prisma.test.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          questions: { select: { id: true } },
          results: { select: { id: true } },
        },
      });
    }
    return prisma.test.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: {
        questions: { select: { id: true } },
        results: { select: { id: true } },
      },
    });
  }

  async findById(id: string) {
    return prisma.test.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { order: "asc" } },
        results: { select: { id: true } },
      },
    });
  }

  async create(data: Prisma.TestCreateInput) {
    return prisma.test.create({
      data,
    });
  }

  async update(id: string, data: Prisma.TestUpdateInput) {
    return prisma.test.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.test.delete({
      where: { id },
    });
  }

  async duplicate(id: string) {
    const original = await prisma.test.findUnique({
      where: { id },
      include: { questions: { orderBy: { order: "asc" } } },
    });

    if (!original) throw new Error("Test not found");

    return prisma.test.create({
      data: {
        title: `${original.title} (Copy)`,
        description: original.description,
        duration: original.duration,
        isActive: false,
        authorId: original.authorId,
        questions: {
          create: original.questions.map((q) => ({
            question: q.question,
            image: q.image,
            options: q.options,
            correctAnswer: q.correctAnswer,
            order: q.order,
          })),
        },
      },
      include: {
        questions: { select: { id: true } },
        results: { select: { id: true } },
      },
    });
  }

  async resetResults(id: string) {
    await prisma.result.deleteMany({
      where: { testId: id },
    });
    return this.findById(id);
  }

  async getActiveTests() {
    const now = new Date();
    return prisma.test.findMany({
      where: {
        isActive: true,
        OR: [
          {
            startDate: null,
            endDate: null,
          },
          {
            startDate: { lte: now },
            endDate: { gte: now },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        startDate: true,
        endDate: true,
      },
    });
  }
}

export const testRepository = new TestRepository();
