import { prisma } from "@/shared/lib/prisma";
import { Prisma, TestStatus } from "@prisma/client";

export class ResultRepository {
  async create(data: Prisma.ResultCreateInput) {
    return prisma.result.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.result.findUnique({
      where: { id },
      include: {
        test: true,
        answers: true,
      },
    });
  }

  async findByStudentNISN(nisn: string) {
    return prisma.result.findMany({
      where: { studentNISN: nisn },
      include: {
        test: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: string, data: Prisma.ResultUpdateInput) {
    return prisma.result.update({
      where: { id },
      data,
    });
  }

  async submitAnswer(resultId: string, questionId: string, answer: string, isCorrect: boolean) {
    // Check if answer already exists
    const existingAnswer = await prisma.answer.findFirst({
      where: {
        resultId,
        questionId,
      },
    });

    if (existingAnswer) {
      return prisma.answer.update({
        where: { id: existingAnswer.id },
        data: {
          selectedAnswer: answer,
          isCorrect,
        },
      });
    }

    return prisma.answer.create({
      data: {
        resultId,
        questionId,
        selectedAnswer: answer,
        isCorrect,
      },
    });
  }

  async finishTest(id: string, score: number, correctAnswers: number, totalQuestions: number, timeSpent: number, status: TestStatus = TestStatus.FINISHED) {
    return prisma.result.update({
      where: { id },
      data: {
        status,
        finishedAt: new Date(),
        score,
        correctAnswers,
        totalQuestions,
        timeSpent,
      },
    });
  }

  async findAll() {
    return prisma.result.findMany({
      include: {
        test: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const resultRepository = new ResultRepository();
