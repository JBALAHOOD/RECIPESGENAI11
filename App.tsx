import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';
import Footer from './components/Footer';
import { Recipe } from './types';
import { findRecipes } from './services/geminiService';

const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearch, setLastSearch] = useState<{ ingredients: string[]; dietaryPreference: string; cookingTime: string; difficulty: string; } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (ingredients: string[], dietaryPreference: string, cookingTime: string, difficulty: string) => {
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setHasSearched(true);
    try {
      const fetchedRecipes = await findRecipes(ingredients.join(', '), dietaryPreference, cookingTime, difficulty);
      setRecipes(fetchedRecipes);
      setLastSearch({ ingredients, dietaryPreference, cookingTime, difficulty });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetMoreIdeas = () => {
    if (lastSearch) {
      handleSearch(lastSearch.ingredients, lastSearch.dietaryPreference, lastSearch.cookingTime, lastSearch.difficulty);
    }
  };

  const NoResultsDisplay = () => (
    <div className="text-center p-8 mt-8">
      <h2 className="text-2xl font-bold text-brand-dark mb-2">No Recipes Found</h2>
      <p className="text-lg text-gray-600">We couldn't find any recipes with those ingredients and filters.</p>
      <p className="text-md text-gray-500 mt-2">Try using different ingredients or adjusting your filters!</p>
    </div>
  );

  const LoadingStateDisplay = () => (
    <div className="text-center p-8 mt-8">
      <div className="flex justify-center items-center mb-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-dark"></div>
      </div>
      <h2 className="text-2xl font-semibold text-brand-dark">Cooking up some fresh ideas... 🍳</h2>
      <p className="text-gray-500 mt-2">Our AI chef is working its magic!</p>
    </div>
  );

  const ErrorStateDisplay = () => (
     <div className="text-center p-8 mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
      <strong className="font-bold">Oops! </strong>
      <span className="block sm:inline">{error}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-text">
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-brand-title font-display">
            What's in your kitchen?
          </h1>
          <p className="mt-4 text-lg text-brand-text max-w-3xl mx-auto">
            Tell us what ingredients you have, and we'll create amazing recipes just for you. No more wondering what to cook!
          </p>
        </div>
        
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {error && <ErrorStateDisplay />}

        {isLoading && <LoadingStateDisplay />}

        {!isLoading && !error && hasSearched && recipes.length === 0 && <NoResultsDisplay />}

        {recipes.length > 0 && (
          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe, index) => (
                <RecipeCard key={`${recipe.title}-${index}`} recipe={recipe} />
              ))}
            </div>
            {lastSearch && (
              <div className="text-center mt-12">
                <button
                  onClick={handleGetMoreIdeas}
                  disabled={isLoading}
                  className="bg-brand-secondary hover:bg-opacity-90 text-brand-dark font-bold py-3 px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-300"
                >
                  Get More Ideas
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
