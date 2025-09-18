import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import ClockIcon from './icons/ClockIcon';
import BookmarkIcon from './icons/BookmarkIcon';
import ShareIcon from './icons/ShareIcon';

interface RecipeCardProps {
  recipe: Recipe;
}

const getSavedRecipes = (): Recipe[] => {
  try {
    const saved = localStorage.getItem('savedRecipes');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error("Could not parse saved recipes from localStorage", e);
    return [];
  }
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedRecipes = getSavedRecipes();
    if (savedRecipes.some(r => r.title === recipe.title)) {
      setIsSaved(true);
    }
  }, [recipe.title]);

  const handleSaveToggle = () => {
    const savedRecipes = getSavedRecipes();
    let newSavedRecipes;
    if (isSaved) {
      newSavedRecipes = savedRecipes.filter(r => r.title !== recipe.title);
    } else {
      newSavedRecipes = [...savedRecipes, recipe];
    }
    localStorage.setItem('savedRecipes', JSON.stringify(newSavedRecipes));
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    const recipeText = `Check out this recipe for ${recipe.title}!\n\n${recipe.description}\n\nTime: ${recipe.time}\nDifficulty: ${recipe.difficulty}\n\nIngredients:\n- ${recipe.ingredients.join('\n- ')}\n\nInstructions:\n${recipe.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipeText,
        });
      } catch (error) {
        console.error('Error sharing recipe:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(recipeText);
        alert('Recipe copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy recipe:', error);
        alert('Could not copy recipe to clipboard.');
      }
    }
  };
  
  const difficultyColors: { [key: string]: string } = {
    'Easy': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Hard': 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
      <img
        src={recipe.imageUrl}
        alt={recipe.title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold text-brand-dark font-serif pr-2">{recipe.title}</h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${difficultyColors[recipe.difficulty] || 'bg-gray-100 text-gray-800'}`}>
                {recipe.difficulty}
            </span>
        </div>
        <p className="text-gray-600 mb-4 flex-grow">{recipe.description}</p>
        
        <div className="flex items-center text-brand-dark mb-6">
          <ClockIcon className="w-5 h-5 mr-2" />
          <span className="font-semibold">{recipe.time}</span>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <h4 className="font-bold text-lg text-brand-dark mb-2 border-b-2 border-brand-accent pb-1">Ingredients</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {recipe.ingredients.map((ing, index) => (
                <li key={index}>{ing}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg text-brand-dark mb-2 border-b-2 border-brand-accent pb-1">Instructions</h4>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200 flex items-center justify-end space-x-2">
            <button onClick={handleSaveToggle} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isSaved ? 'bg-brand-accent/50 text-brand-dark' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}>
                <BookmarkIcon isFilled={isSaved} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
             <button onClick={handleShare} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                <ShareIcon />
                <span>Share</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
