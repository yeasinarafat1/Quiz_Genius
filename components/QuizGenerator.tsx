import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuizFromText } from '../services/gemini';
import { saveQuiz } from '../services/storage';
import { Quiz, Difficulty } from '../types';
import { Button } from './Button';
import { Sparkles, FileText, ArrowRight, BarChart3, ListChecks } from 'lucide-react';

export const QuizGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Please enter some text first.");
      return;
    }
    if (text.length < 50) {
      setError("Please enter a bit more text (at least 50 characters) for a better quiz.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const generatedData = await generateQuizFromText(text, difficulty, questionCount);
      
      const newQuiz: Quiz = {
        ...generatedData,
        id: `quiz-${Date.now()}`,
        createdAt: Date.now(),
        sourceTextPreview: text.substring(0, 150) + (text.length > 150 ? "..." : ""),
        difficulty: difficulty,
      };

      saveQuiz(newQuiz);
      // Navigate to the quiz player
      navigate(`/quiz/${newQuiz.id}`);
      
    } catch (err) {
      setError("Failed to generate quiz. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const DifficultyButton = ({ level, current }: { level: Difficulty; current: Difficulty }) => {
    const isSelected = level === current;
    let colorClass = "";
    
    if (level === 'Easy') colorClass = isSelected ? "bg-emerald-100 border-emerald-500 text-emerald-800" : "hover:bg-emerald-50 text-slate-600";
    if (level === 'Medium') colorClass = isSelected ? "bg-indigo-100 border-indigo-500 text-indigo-800" : "hover:bg-indigo-50 text-slate-600";
    if (level === 'Hard') colorClass = isSelected ? "bg-rose-100 border-rose-500 text-rose-800" : "hover:bg-rose-50 text-slate-600";

    return (
      <button
        onClick={() => setDifficulty(level)}
        className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all font-medium text-sm ${
          isSelected ? "border-current shadow-sm scale-105" : "border-transparent bg-slate-50"
        } ${colorClass}`}
        type="button"
      >
        {level}
      </button>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Turn Text into Knowledge</h2>
        <p className="text-slate-600">
          Paste your notes, article, or documentation below, and our AI will instantly create a quiz for you.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        
        {/* Settings Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Difficulty Selector */}
          <div className="flex flex-col gap-2 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
            <label className="flex items-center gap-2 text-slate-700 font-medium text-sm">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Difficulty
            </label>
            <div className="flex gap-2">
              <DifficultyButton level="Easy" current={difficulty} />
              <DifficultyButton level="Medium" current={difficulty} />
              <DifficultyButton level="Hard" current={difficulty} />
            </div>
          </div>

          {/* Question Count Selector */}
          <div className="flex flex-col gap-2 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
            <label className="flex items-center gap-2 text-slate-700 font-medium text-sm">
              <ListChecks className="w-4 h-4 text-indigo-500" />
              Questions
            </label>
            <div className="flex gap-2 h-full">
              {[5, 10, 15].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all font-medium text-sm ${
                    questionCount === count
                      ? "bg-indigo-100 border-indigo-500 text-indigo-800 shadow-sm scale-105"
                      : "border-transparent bg-slate-50 hover:bg-indigo-50 text-slate-600"
                  }`}
                  type="button"
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <textarea
            className="w-full h-64 p-4 rounded-xl resize-none outline-none text-slate-700 placeholder:text-slate-400 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            placeholder="Paste your study notes or text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isGenerating}
          />
          <div className="absolute bottom-4 right-4 text-xs text-slate-400 pointer-events-none bg-white/80 px-2 rounded">
             {text.length} chars
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setText('')}
              disabled={isGenerating || text.length === 0}
            >
              Clear
            </Button>
            <Button 
              onClick={handleGenerate} 
              isLoading={isGenerating}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Generate {questionCount} Questions
            </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2 text-sm animate-pulse">
           <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {/* Suggestion Chips */}
      {!text && (
        <div className="flex flex-wrap gap-2 justify-center mt-8">
          <p className="w-full text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Try with...</p>
          {['Photosynthesis Wikipedia Intro', 'React Hooks Documentation', 'The Great Gatsby Summary', 'Newton\'s Laws'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setText(`${suggestion}: Note - In a real app this would fetch the text. For now, just type about ${suggestion}...`)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};