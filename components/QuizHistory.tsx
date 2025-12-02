import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllQuizResults, getQuizById } from '../services/storage';
import { QuizResult, Quiz } from '../types';
import { Calendar, LayoutList, Ban, ArrowRight, History as HistoryIcon } from 'lucide-react';
import { Button } from './Button';

export const QuizHistory: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<{ result: QuizResult; quiz?: Quiz }[]>([]);

  useEffect(() => {
    const results = getAllQuizResults();
    // Map results to include quiz details (if available)
    const historyData = Object.values(results)
      .map((result) => ({
        result,
        quiz: getQuizById(result.quizId),
      }))
      // Sort by completion date (newest first)
      .sort((a, b) => b.result.completedAt - a.result.completedAt);
    
    setHistory(historyData);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HistoryIcon className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">No History Yet</h2>
        <p className="text-slate-500 mb-6">Complete a quiz to see your progress here.</p>
        <Button onClick={() => navigate('/')}>Explore Quizzes</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
           <LayoutList className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your History</h2>
          <p className="text-slate-500">Track your learning journey and past scores</p>
        </div>
      </div>

      <div className="grid gap-4">
        {history.map(({ result, quiz }) => {
          const percentage = Math.round((result.score / result.totalQuestions) * 100);
          
          return (
            <div 
              key={result.quizId} 
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                {quiz ? (
                  <h3 
                    className="text-lg font-bold text-slate-900 mb-1 hover:text-indigo-600 cursor-pointer transition-colors" 
                    onClick={() => navigate(`/quiz/${result.quizId}`)}
                  >
                    {quiz.title}
                  </h3>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Ban className="w-4 h-4" />
                    <span className="font-medium italic">Deleted Quiz</span>
                  </div>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(result.completedAt)}
                  </span>
                  {quiz && (
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs font-medium text-slate-600">
                      {quiz.difficulty}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className={`flex flex-col items-center px-4 py-2 rounded-xl border ${getScoreColor(percentage)}`}>
                   <span className="text-xs font-bold uppercase tracking-wider opacity-80">Score</span>
                   <span className="text-xl font-bold">{percentage}%</span>
                </div>
                
                {quiz && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate(`/quiz/${result.quizId}`)}
                    className="group"
                  >
                    Review <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};