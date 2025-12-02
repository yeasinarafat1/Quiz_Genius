import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Quiz, QuizResult } from '../types';
import { getQuizzes, deleteQuiz, getAllQuizResults } from '../services/storage';
import { Button } from './Button';
import { Play, Trash2, Tag, Signal, Trophy, CheckCircle2 } from 'lucide-react';

export const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [results, setResults] = useState<Record<string, QuizResult>>({});
  const navigate = useNavigate();

  const loadData = () => {
    setQuizzes(getQuizzes());
    setResults(getAllQuizResults());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      deleteQuiz(id);
      loadData();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-50 text-emerald-700';
      case 'Medium': return 'bg-yellow-50 text-yellow-700';
      case 'Hard': return 'bg-rose-50 text-rose-700';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Quiz Library</h2>
           <p className="text-slate-500">Explore generated knowledge checks</p>
        </div>
        <Button onClick={() => navigate('/create')}>+ New Quiz</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.length === 0 ? (
           <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-500 mb-4">No quizzes found. Start your journey!</p>
              <Button onClick={() => navigate('/create')}>Create First Quiz</Button>
           </div>
        ) : (
          quizzes.map((quiz) => {
            const result = results[quiz.id];
            const isCompleted = !!result;
            const scorePercentage = isCompleted ? Math.round((result.score / result.totalQuestions) * 100) : 0;

            return (
              <div 
                key={quiz.id} 
                className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col group overflow-hidden cursor-pointer ${
                  isCompleted ? 'border-indigo-200 ring-1 ring-indigo-50 hover:shadow-lg' : 'border-slate-200 hover:shadow-lg hover:border-indigo-200'
                }`}
                onClick={() => navigate(`/quiz/${quiz.id}`)}
              >
                <div className="p-6 flex-grow relative">
                  {/* Completed Badge */}
                  {isCompleted && (
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 z-10">
                      <Trophy className="w-3 h-3 text-yellow-300" />
                      {scorePercentage}%
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2 mb-2 pr-8">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                          <Signal className="w-3 h-3 mr-1" />
                          {quiz.difficulty || 'Medium'}
                        </span>
                      {quiz.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, quiz.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                    {quiz.description}
                  </p>
                </div>

                <div className={`px-6 py-4 border-t flex justify-between items-center text-sm ${isCompleted ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Tag className="w-3 h-3" /> {quiz.questions.length} Qs
                  </span>
                  
                  {isCompleted ? (
                    <span className="text-indigo-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </span>
                  ) : (
                    <span className="text-slate-500 group-hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors">
                      Play Now <Play className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
