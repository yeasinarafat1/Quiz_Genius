import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { BrainCircuit, BookOpen, PlusCircle, History } from 'lucide-react';
import { QuizGenerator } from './components/QuizGenerator';
import { QuizList } from './components/QuizList';
import { QuizPlayer } from './components/QuizPlayer';
import { QuizHistory } from './components/QuizHistory';
import { Quiz } from './types';
import { getQuizById } from './services/storage';

// Wrapper component to handle fetching quiz by ID from URL
const QuizPlayerRoute = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const found = getQuizById(id);
      if (found) {
        setQuiz(found);
      } else {
        // Quiz not found
        console.error("Quiz not found");
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Quiz Not Found</h2>
        <p className="text-slate-500 mb-6">The quiz you are looking for does not exist or has been deleted.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Back to Library
        </button>
      </div>
    );
  }

  return <QuizPlayer quiz={quiz} onExit={() => navigate('/')} />;
};

// Navigation Component
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            QuizGenius
          </h1>
        </div>

        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`p-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              currentPath === '/' 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Library</span>
          </Link>
          <Link
            to="/history"
            className={`p-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              currentPath === '/history' 
                ? 'bg-slate-100 text-slate-900' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Link>
          <Link
            to="/create"
            className={`p-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              currentPath === '/create' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <NavBar />
        <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<QuizList />} />
            <Route path="/create" element={<QuizGenerator />} />
            <Route path="/history" element={<QuizHistory />} />
            <Route path="/quiz/:id" element={<QuizPlayerRoute />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-6">
          <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} QuizGenius. Built for Hackathons.</p>
            <p className="mt-1 text-xs">Powered by Google Gemini 2.5 Flash</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;