import {   useNavigate,  Link, useLocation } from 'react-router-dom';
import { BrainCircuit, BookOpen, PlusCircle, History } from 'lucide-react';

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
export default NavBar;