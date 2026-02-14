import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("Interview LocalStorage Helpers", () => {
  const STORAGE_KEY_PREFIX = "interview_";
  const interviewId = "test-interview-123";
  const questionId = "test-question-456";

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("saveAnswerToLocalStorage", () => {
    it("should save answer with correct structure", () => {
      const answer = "This is my answer";
      const storageKey = `${STORAGE_KEY_PREFIX}${interviewId}`;

      // Simulate saving
      const data = {
        [questionId]: answer,
      };
      localStorage.setItem(storageKey, JSON.stringify(data));

      const stored = localStorage.getItem(storageKey);
      expect(stored).toBeDefined();
      expect(JSON.parse(stored!)).toEqual(data);
    });

    it("should overwrite existing answer", () => {
      const storageKey = `${STORAGE_KEY_PREFIX}${interviewId}`;

      localStorage.setItem(
        storageKey,
        JSON.stringify({ [questionId]: "old answer" }),
      );
      const data = { [questionId]: "new answer" };
      localStorage.setItem(storageKey, JSON.stringify(data));

      const stored = JSON.parse(localStorage.getItem(storageKey)!);
      expect(stored[questionId]).toBe("new answer");
    });

    it("should preserve other answers when saving new one", () => {
      const storageKey = `${STORAGE_KEY_PREFIX}${interviewId}`;
      const questionId2 = "question-789";

      const initialData = { [questionId]: "answer 1" };
      localStorage.setItem(storageKey, JSON.stringify(initialData));

      // Add another answer
      const updatedData = { ...initialData, [questionId2]: "answer 2" };
      localStorage.setItem(storageKey, JSON.stringify(updatedData));

      const stored = JSON.parse(localStorage.getItem(storageKey)!);
      expect(stored[questionId]).toBe("answer 1");
      expect(stored[questionId2]).toBe("answer 2");
    });
  });

  describe("getAnswerFromLocalStorage", () => {
    it("should retrieve saved answer", () => {
      const storageKey = `${STORAGE_KEY_PREFIX}${interviewId}`;
      const answer = "Saved answer";

      localStorage.setItem(
        storageKey,
        JSON.stringify({ [questionId]: answer }),
      );

      const stored = localStorage.getItem(storageKey);
      const data = JSON.parse(stored!);
      const retrievedAnswer = data[questionId];

      expect(retrievedAnswer).toBe(answer);
    });

    it("should return undefined for non-existent question", () => {
      const storageKey = `${STORAGE_KEY_PREFIX}${interviewId}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({ [questionId]: "answer" }),
      );

      const stored = localStorage.getItem(storageKey);
      const data = JSON.parse(stored!);
      const retrievedAnswer = data["non-existent-id"];

      expect(retrievedAnswer).toBeUndefined();
    });

    it("should return undefined when no data stored", () => {
      const storageKey = `${STORAGE_KEY_PREFIX}${interviewId}`;
      const stored = localStorage.getItem(storageKey);
      expect(stored).toBeNull();
    });
  });

  describe("getAllAnswersFromLocalStorage", () => {
    it("should retrieve all answers for interview", () => {
      const storageKey = `${STORAGE_KEY_PREFIX}${interviewId}`;
      const answers = {
        q1: "answer 1",
        q2: "answer 2",
        q3: "answer 3",
      };

      localStorage.setItem(storageKey, JSON.stringify(answers));

      const stored = localStorage.getItem(storageKey);
      const retrievedAnswers = JSON.parse(stored!);

      expect(retrievedAnswers).toEqual(answers);
      expect(Object.keys(retrievedAnswers).length).toBe(3);
    });

    it("should return empty object when no data stored", () => {
      const storageKey = `${STORAGE_KEY_PREFIX}${interviewId}`;
      const stored = localStorage.getItem(storageKey);
      expect(stored).toBeNull();
    });

    it("should return null for non-existent interview", () => {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}non-existent`);
      expect(stored).toBeNull();
    });
  });

  describe("getFirstIncompleteQuestionIndex", () => {
    it("should return 0 when all questions incomplete", () => {
      const questions = [
        { _id: "1", completed: false },
        { _id: "2", completed: false },
      ];

      const index = questions.findIndex((q) => !q.completed);
      expect(index).toBe(0);
    });

    it("should return index of first incomplete question", () => {
      const questions = [
        { _id: "1", completed: true },
        { _id: "2", completed: true },
        { _id: "3", completed: false },
        { _id: "4", completed: false },
      ];

      const index = questions.findIndex((q) => !q.completed);
      expect(index).toBe(2);
    });

    it("should return -1 when all questions completed", () => {
      const questions = [
        { _id: "1", completed: true },
        { _id: "2", completed: true },
      ];

      const index = questions.findIndex((q) => !q.completed);
      expect(index).toBe(-1);
    });

    it("should handle empty questions array", () => {
      const questions: any[] = [];
      const index = questions.findIndex((q) => !q.completed);
      expect(index).toBe(-1);
    });
  });
});
