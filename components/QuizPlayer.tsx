import React, { useState, useEffect } from 'react';
import { Quiz, QuizResult } from '../types';
import { Button } from './Button';
import { saveQuizResult, getQuizResult } from '../services/storage';
import { CheckCircle, XCircle, ChevronRight, RotateCcw, Award, Share2, Copy, X, History } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface QuizPlayerProps {
  quiz: Quiz;
  onExit: () => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]); // Stores indices of selected answers
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false); // New state to indicate reviewing past attempt

  // Load previous result if exists
  useEffect(() => {
    const prevResult = getQuizResult(quiz.id);
    if (prevResult) {
      setScore(prevResult.score);
      setAnswers(prevResult.answers);
      setIsFinished(true);
      setIsReviewMode(true);
    }
  }, [quiz.id]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  // Construct a shareable URL (using HashRouter syntax)
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}#/quiz/${quiz.id}`
    : '';
    
  const shareText = `Check out this quiz I generated with QuizGenius: "${quiz.title}"!`;

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === currentQuestion.correctIndex;
    let newScore = score;
    if (isCorrect) {
      newScore = score + 1;
      setScore(newScore);
    }
    
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setIsAnswered(true);

    // If this was the last question, save the result immediately
    if (currentQuestionIndex === quiz.questions.length - 1) {
       const result: QuizResult = {
         quizId: quiz.id,
         score: newScore,
         totalQuestions: quiz.questions.length,
         answers: newAnswers,
         completedAt: Date.now()
       };
       saveQuizResult(result);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const calculatePercentage = () => Math.round((score / quiz.questions.length) * 100);

  // Results Screen
  if (isFinished) {
    const percentage = calculatePercentage();
    const data = [
      { name: 'Correct', value: score },
      { name: 'Incorrect', value: quiz.questions.length - score },
    ];
    const COLORS = ['#10b981', '#ef4444']; // Emerald-500, Red-500

    return (
      <div className="max-w-2xl mx-auto animate-fadeIn relative">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-8 text-center bg-indigo-600 text-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
             <div className="relative z-10">
               {isReviewMode && (
                 <div className="absolute top-0 right-0 bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-1">
                   <History className="w-3 h-3" /> Previous Result
                 </div>
               )}
               <Award className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
               <h2 className="text-3xl font-bold mb-2">
                 {isReviewMode ? "Welcome Back!" : "Quiz Completed!"}
               </h2>
               <p className="text-indigo-100">You scored {score} out of {quiz.questions.length}</p>
             </div>
          </div>

          <div className="p-8">
            <div className="h-64 w-full mb-8">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center -mt-36">
                <span className="text-4xl font-bold text-slate-800">{percentage}%</span>
              </div>
              <div className="mt-24"></div> {/* Spacer for the negative margin above */}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                 <p className="text-sm text-emerald-600 font-semibold uppercase tracking-wider">Correct</p>
                 <p className="text-2xl font-bold text-emerald-700">{score}</p>
               </div>
               <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-center">
                 <p className="text-sm text-red-600 font-semibold uppercase tracking-wider">Incorrect</p>
                 <p className="text-2xl font-bold text-red-700">{quiz.questions.length - score}</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" onClick={onExit}>Back to Library</Button>
              <Button onClick={() => {
                setIsFinished(false);
                setIsReviewMode(false);
                setCurrentQuestionIndex(0);
                setScore(0);
                setAnswers([]);
                setIsAnswered(false);
                setSelectedOption(null);
              }} icon={<RotateCcw className="w-4 h-4"/>}>
                {isReviewMode ? "Retake Quiz" : "Try Again"}
              </Button>
               <Button variant="secondary" onClick={() => setShowShareModal(true)} icon={<Share2 className="w-4 h-4"/>}>Share Quiz</Button>
            </div>
          </div>
        </div>
        
        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShareModal(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-slate-800">Share this Quiz</h3>
                 <button onClick={() => setShowShareModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
               </div>
               
               <p className="text-slate-500 mb-4 text-sm">Challenge your friends to beat your score!</p>

               <div className="space-y-4">
                 {/* Copy Link */}
                 <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Unique Link</label>
                    <div className="flex gap-2">
                       <input 
                          type="text" 
                          readOnly 
                          value={shareUrl}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none"
                       />
                       <Button size="sm" onClick={handleCopyLink} icon={copySuccess ? <CheckCircle className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}>
                         {copySuccess ? "Copied" : "Copy"}
                       </Button>
                    </div>
                 </div>

                 {/* Social Buttons */}
                 <div className="grid grid-cols-2 gap-3">
                   <a 
                     href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center justify-center gap-2 bg-[#1DA1F2] text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                   >
                     Twitter
                   </a>
                   <a 
                     href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center justify-center gap-2 bg-[#4267B2] text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                   >
                     Facebook
                   </a>
                 </div>
                 
                 {/* Embed Code */}
                 <div>
                    <label className="text-xs font-semibold text-slate-700 uppercase mb-1 block">Embed Code</label>
                    <textarea 
                      readOnly
                      className="w-full h-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 font-mono resize-none focus:outline-none"
                      value={`<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`}
                    />
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Quiz Taking Screen
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 flex items-center justify-between text-sm font-medium text-slate-500">
        <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
        <span>{Math.round(((currentQuestionIndex) / quiz.questions.length) * 100)}% completed</span>
      </div>
      <div className="w-full bg-slate-200 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-indigo-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
           <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-slate-800 leading-relaxed max-w-[90%]">
                {currentQuestion.text}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-500 font-medium`}>
                 {quiz.difficulty}
              </span>
           </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = currentQuestion.correctIndex === idx;
              
              let baseStyle = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ";
              
              if (isAnswered) {
                if (isCorrect) {
                  baseStyle += "bg-emerald-50 border-emerald-500 text-emerald-800";
                } else if (isSelected && !isCorrect) {
                  baseStyle += "bg-red-50 border-red-500 text-red-800 opacity-75";
                } else {
                  baseStyle += "border-slate-100 text-slate-400 opacity-50";
                }
              } else {
                if (isSelected) {
                  baseStyle += "border-indigo-600 bg-indigo-50 text-indigo-900";
                } else {
                  baseStyle += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={baseStyle}
                  disabled={isAnswered}
                >
                  <span className="font-medium">{option}</span>
                  {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                </button>
              );
            })}
          </div>

          {isAnswered && currentQuestion.explanation && (
             <div className="mt-6 p-4 bg-indigo-50 rounded-xl text-indigo-800 text-sm animate-fadeIn">
                <span className="font-bold block mb-1">Explanation:</span>
                {currentQuestion.explanation}
             </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
           <Button variant="ghost" onClick={onExit} size="sm">Quit</Button>
           
           {!isAnswered ? (
             <Button 
                onClick={handleCheckAnswer} 
                disabled={selectedOption === null}
                className="w-32"
              >
                Check
              </Button>
           ) : (
             <Button onClick={handleNext} className="w-32" icon={<ChevronRight className="w-4 h-4" />}>
               {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
             </Button>
           )}
        </div>
      </div>
    </div>
  );
};
