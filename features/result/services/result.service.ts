import { resultRepository } from "../repositories/result.repository";
import { questionRepository } from "../../question/repositories/question.repository";
import { TestStatus } from "@prisma/client";

export class ResultService {
  async startTest(testId: string, studentData: { name: string; nisn?: string; email?: string; phone?: string }) {
    // Create a new result entry
    return resultRepository.create({
      test: { connect: { id: testId } },
      studentName: studentData.name,
      studentNISN: studentData.nisn,
      studentEmail: studentData.email,
      studentPhone: studentData.phone,
      startedAt: new Date(),
      status: TestStatus.IN_PROGRESS,
    });
  }

  async getResultById(id: string) {
    return resultRepository.findById(id);
  }

  async submitAnswer(resultId: string, questionId: string, selectedAnswer: string) {
    // 1. Get the question to check correct answer
    const question = await questionRepository.findById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    // 2. Check correctness
    const isCorrect = question.correctAnswer === selectedAnswer;

    // 3. Save answer
    return resultRepository.submitAnswer(resultId, questionId, selectedAnswer, isCorrect);
  }

  async finishTest(resultId: string) {
    // 1. Get full result with answers
    const result = await resultRepository.findById(resultId);
    if (!result) throw new Error("Result not found");

    // 2. Calculate stats
    // We need to count correct answers. 
    // Since we are updating isCorrect on submit, we can just sum them up from the answers relation or count them
    // But result.answers might be partial if we didn't include them in findById (we did)
    
    // However, finding all answers again ensures we have latest state
    const answers = result.answers;
    const correctAnswersCount = answers.filter(a => a.isCorrect).length;
    const totalQuestions = await questionRepository.countByTestId(result.testId);

    // Score calculation (simple percentage * 10 or 100, or just correct count)
    // Let's assume 100 base.
    const score = totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 0;

    const startTime = new Date(result.startedAt).getTime();
    const endTime = new Date().getTime();
    const timeSpent = Math.floor((endTime - startTime) / 1000); // seconds

    // 3. Update result
    return resultRepository.finishTest(
      resultId,
      score,
      correctAnswersCount,
      totalQuestions,
      timeSpent,
      TestStatus.FINISHED
    );
  }

  async getAllResults() {
    return resultRepository.findAll();
  }
}

export const resultService = new ResultService();
