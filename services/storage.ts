import { Quiz, QuizResult } from "../types";

// Key for localStorage
const QUIZ_STORAGE_KEY = "quizgenius_library_v1";
const RESULT_STORAGE_KEY = "quizgenius_results_v1";

// Pre-loaded sample quizzes for the "Wow" factor
const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: "sample-1",
    title: "The Rise of Artificial Intelligence",
    description: "Test your knowledge on the history and concepts of AI.",
    sourceTextPreview: "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans...",
    createdAt: Date.now(),
    tags: ["Tech", "AI", "Computer Science"],
    difficulty: "Medium",
    questions: [
      {
        id: "q1",
        text: "Who is often considered the father of Artificial Intelligence?",
        options: ["Alan Turing", "Elon Musk", "Bill Gates", "Steve Jobs"],
        correctIndex: 0,
        explanation: "Alan Turing's work on the Turing Machine and the Turing Test laid the theoretical foundations for AI."
      },
      {
        id: "q2",
        text: "What does 'LLM' stand for in modern AI?",
        options: ["Large Learning Mechanism", "Large Language Model", "Long Latency Machine", "Linear Logic Module"],
        correctIndex: 1,
        explanation: "LLMs like Gemini are trained on vast amounts of text data to understand and generate human language."
      },
      {
        id: "q3",
        text: "Which type of learning involves an agent learning from rewards and punishments?",
        options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Deep Learning"],
        correctIndex: 2,
        explanation: "Reinforcement learning is based on interacting with an environment and receiving feedback in the form of rewards or penalties."
      }
    ]
  }
];

export const saveQuiz = (quiz: Quiz): void => {
  const current = getQuizzes();
  // Add to beginning
  const updated = [quiz, ...current];
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(updated));
};

export const getQuizzes = (): Quiz[] => {
  const data = localStorage.getItem(QUIZ_STORAGE_KEY);
  if (!data) {
    // Return samples if empty
    return SAMPLE_QUIZZES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return SAMPLE_QUIZZES;
  }
};

export const getQuizById = (id: string): Quiz | undefined => {
  const quizzes = getQuizzes();
  return quizzes.find((q) => q.id === id);
};

export const deleteQuiz = (id: string): void => {
  const current = getQuizzes();
  const updated = current.filter((q) => q.id !== id);
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(updated));
};

// --- Result / History Handling ---

export const saveQuizResult = (result: QuizResult): void => {
  const results = getAllQuizResults();
  // Save result keyed by quizId (overwriting previous attempts for simplicity in this MVP, 
  // or you could store an array of attempts)
  results[result.quizId] = result;
  localStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(results));
};

export const getQuizResult = (quizId: string): QuizResult | null => {
  const results = getAllQuizResults();
  return results[quizId] || null;
};

export const getAllQuizResults = (): Record<string, QuizResult> => {
  const data = localStorage.getItem(RESULT_STORAGE_KEY);
  if (!data) return {};
  try {
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
};
