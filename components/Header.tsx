
import React from 'react';
import ChefHatIcon from './icons/ChefHatIcon';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 bg-brand-primary/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-center text-center">
        <ChefHatIcon className="w-8 h-8 sm:w-10 sm:h-10 text-brand-dark" />
        <h1 className="ml-3 text-2xl sm:text-4xl font-bold text-brand-dark font-serif tracking-tight">
          AI Recipe Finder
        </h1>
      </div>
    </header>
  );
};

export default Header;
