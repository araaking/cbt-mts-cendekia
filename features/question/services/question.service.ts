import { questionRepository } from "../repositories/question.repository";

export class QuestionService {
  async getQuestionsByTestId(testId: string) {
    return questionRepository.findByTestId(testId);
  }

  async getQuestionById(id: string) {
    return questionRepository.findById(id);
  }

  async createQuestion(data: { testId: string; question: string; options: string[]; correctAnswer: string; image?: string | null }) {
    const count = await questionRepository.countByTestId(data.testId);
    return questionRepository.create({
      test: { connect: { id: data.testId } },
      question: data.question,
      options: data.options,
      correctAnswer: data.correctAnswer,
      image: data.image,
      order: count + 1,
    });
  }

  async updateQuestion(id: string, data: Prisma.QuestionUpdateInput) {
    return questionRepository.update(id, data);
  }

  async deleteQuestion(id: string) {
    return questionRepository.delete(id);
  }
}

export const questionService = new QuestionService();
