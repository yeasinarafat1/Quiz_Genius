export interface QuizOption {
  text: string;
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  sourceTextPreview: string;
  questions: QuizQuestion[];
  createdAt: number;
  tags?: string[];
  difficulty: Difficulty;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: number[]; // Index of selected option per question
  completedAt: number;
}
