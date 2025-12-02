import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} QuizGenius. Believe in Inovation.</p>
        <p className="mt-1 text-xs">Created by Yeasin Arafat</p>
      </div>
    </footer>
  );
};

export default Footer;
