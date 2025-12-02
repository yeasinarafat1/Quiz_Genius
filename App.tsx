import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { QuizGenerator } from './components/QuizGenerator';
import { QuizList } from './components/QuizList';
import { QuizPlayer } from './components/QuizPlayer';
import { QuizHistory } from './components/QuizHistory';
import { Quiz } from './types';
import { getQuizById } from './services/storage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

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
        
        
        <Footer/>
      </div>
    </Router>
  );
}

export default App;