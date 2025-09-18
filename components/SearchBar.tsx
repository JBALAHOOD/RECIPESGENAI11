import React, { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (ingredients: string[], dietaryPreference: string, cookingTime: string, difficulty: string) => void;
  isLoading: boolean;
}

// Icon Components
// ... (Your existing Icon components: VegetarianIcon, VeganIcon, etc.)
const VegetarianIcon: React.FC = () => (
  <svg className="h-5 w-5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
    <path d="M12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.01 0 1.97.25 2.8.7l-1.46 1.46C13.01 8.9 12.52 8.5 12 8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5c.52 0 1.01-.1 1.44-.3l1.46 1.46c-.83.45-1.79.7-2.8.7z"></path>
  </svg>
);

const VeganIcon: React.FC = () => (
  <svg className="h-5 w-5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const GlutenFreeIcon: React.FC = () => (
    <svg className="h-5 w-5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 22l20-20" />
        <path d="M11.5 2C10 2 8 3 8 5s2 3 4 3 4-1 4-3-2-3-4-3zm0 18c-2 0-4 1-4 3s2 3 4 3 4-1 4-3-2-3-4-3zm-5-9c-1.5 0-3 1-3 2.5S5 14 6.5 14s3-1 3-2.5-1.5-2.5-3-2.5zm10 0c-1.5 0-3 1-3 2.5s1.5 2.5 3 2.5 3-1 3-2.5-1.5-2.5-3-2.5z"/>
    </svg>
);

const KetoIcon: React.FC = () => (
  <svg className="h-5 w-5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l.54 1.62h1.7l-1.38 1 .54 1.62-1.38-1-1.38 1 .54-1.62-1.38-1h1.7zM12 21.31l-5-15h10z" />
  </svg>
);

const LowCarbIcon: React.FC = () => (
    <svg className="h-5 w-5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9z"></path>
        <path d="m9 14 3-3 3 3"></path><path d="m9 11 3-3 3 3"></path>
    </svg>
);


const dietaryOptions = [
  { name: 'Vegetarian', value: 'vegetarian', icon: <VegetarianIcon /> },
  { name: 'Vegan', value: 'vegan', icon: <VeganIcon /> },
  { name: 'Gluten-Free', value: 'gluten-free', icon: <GlutenFreeIcon /> },
  { name: 'Keto', value: 'keto', icon: <KetoIcon /> },
  { name: 'Low-Carb', value: 'low-carb', icon: <LowCarbIcon /> },
];

const popularIngredients = [
  'beef', 'salmon', 'tuna', 'sardines', 'shrimp', 'lentils', 'chickpeas', 
  'black beans', 'kidney beans', 'white beans', 'tofu', 'tempeh',
  'bread', 'tortillas', 'oats', 'quinoa', 'couscous', 'ramen', 'rice noodles', 'soba', 'pasta',
  'olive oil', 'vegetable oil', 'butter', 'flour', 'sugar', 'honey', 'soy sauce',
  'balsamic vinegar', 'apple cider vinegar', 'white vinegar', 'cumin', 'paprika', 
  'chili', 'curry powder', 'cinnamon', 'black pepper', 'salt',
  'milk', 'yogurt', 'cream', 'feta cheese', 'mozzarella', 'cheese', 'eggs',
  'bell peppers', 'zucchini', 'mushrooms', 'cabbage', 'onion', 'parsley', 'cilantro', 
  'basil', 'mint', 'lemon', 'lime',
  'apples', 'bananas', 'oranges', 'berries'
];

const ingredientIcons: { [key: string]: string } = {
  beef: '🥩', salmon: '🐟', tuna: '🐟', sardines: '🐟', shrimp: '🦐', 
  lentils: '🫘', chickpeas: '🫘', 'black beans': '🫘', 'kidney beans': '🫘', 'white beans': '🫘',
  tofu: '🧈', tempeh: '🧈', bread: '🍞', tortillas: '🌯', oats: '🌾', quinoa: '🌾', 
  couscous: '🌾', ramen: '🍜', 'rice noodles': '🍜', soba: '🍜', pasta: '🍝',
  'olive oil': '🫒', 'vegetable oil': '🛢️', butter: '🧈', flour: '🌾', sugar: '🍯', 
  honey: '🍯', 'soy sauce': '🥢', 'balsamic vinegar': '🍶', 'apple cider vinegar': '🍶', 
  'white vinegar': '🍶', cumin: '🌶️', paprika: '🌶️', chili: '🌶️', 'curry powder': '🌶️', 
  cinnamon: '🌶️', 'black pepper': '🌶️', salt: '🧂',
  milk: '🥛', yogurt: '🥛', cream: '🥛', 'feta cheese': '🧀', mozzarella: '🧀', cheese: '🧀', eggs: '🥚',
  'bell peppers': '🫑', zucchini: '🥒', mushrooms: '🍄', cabbage: '🥬', onion: '🧅',
  parsley: '🌿', cilantro: '🌿', basil: '🌿', mint: '🌿', lemon: '🍋', lime: '🍋',
  apples: '🍎', bananas: '🍌', oranges: '🍊', berries: '🫐'
};

const styleMap: { [key: string]: string } = {
  vegetarian: "bg-vegetarian-bg border-vegetarian-border text-vegetarian-text",
  vegan: "bg-vegan-bg border-vegan-border text-vegan-text",
  'gluten-free': "bg-gluten-free-bg border-gluten-free-border text-gluten-free-text",
  keto: "bg-keto-bg border-keto-border text-keto-text",
  'low-carb': "bg-low-carb-bg border-low-carb-border text-low-carb-text"
};

const FilterButton: React.FC<{label: string, value: string, currentValue: string, onClick: (value: string) => void}> = ({ label, value, currentValue, onClick }) => {
  const isSelected = value === currentValue;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
        isSelected
          ? 'bg-brand-dark text-white shadow'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
};


const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryPreference, setDietaryPreference] = useState('');
  const [cookingTime, setCookingTime] = useState('any');
  const [difficulty, setDifficulty] = useState('any');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fuzzy matching function
  const fuzzyMatch = (pattern: string, str: string): boolean => {
    const patternLower = pattern.toLowerCase();
    const strLower = str.toLowerCase();
    
    if (strLower.includes(patternLower)) return true;
    
    let patternIdx = 0;
    for (let i = 0; i < strLower.length && patternIdx < patternLower.length; i++) {
      if (strLower[i] === patternLower[patternIdx]) {
        patternIdx++;
      }
    }
    return patternIdx === patternLower.length;
  };

  // Update suggestions based on input
  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const filtered = popularIngredients
        .filter(ingredient => 
          !ingredients.includes(ingredient.toLowerCase()) && 
          fuzzyMatch(inputValue, ingredient)
        )
        .slice(0, 6); // Limit to 6 suggestions
      
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestionIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  }, [inputValue, ingredients]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addIngredient = (ingredient: string) => {
    const formattedIngredient = ingredient.trim().toLowerCase();
    if (formattedIngredient && !ingredients.includes(formattedIngredient)) {
      setIngredients([...ingredients, formattedIngredient]);
    }
    setInputValue('');
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const removeIngredient = (indexToRemove: number) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestionIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedSuggestionIndex >= 0) {
            addIngredient(suggestions[selectedSuggestionIndex]);
          } else if (inputValue.trim()) {
            addIngredient(inputValue);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedSuggestionIndex(-1);
          break;
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addIngredient(inputValue);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    addIngredient(suggestion);
  };

  const handleDietarySelect = (value: string) => {
    setDietaryPreference(prev => (prev === value ? '' : value));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length > 0) {
      onSearch(ingredients, dietaryPreference || 'none', cookingTime, difficulty);
    }
  };



  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200">
      <form onSubmit={handleSubmit}>
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => inputValue.trim() && suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Enter an ingredient (e.g., chicken, tomato, rice)..."
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-dark/50 focus:border-brand-dark/80 transition duration-200"
                disabled={isLoading}
                aria-label="Add an ingredient"
                autoComplete="off"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto animate-fade-in"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`flex items-center px-4 py-3 cursor-pointer transition-colors ${
                      index === selectedSuggestionIndex 
                        ? 'bg-brand-dark/10 text-brand-dark' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3 text-lg">
                      {ingredientIcons[suggestion] || '🍲'}
                    </span>
                    <span className="font-medium">{suggestion}</span>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="min-h-[3rem] flex flex-wrap gap-2 my-4">
            {ingredients.map((ing, index) => (
                <span key={index} className="flex items-center bg-brand-accent/30 text-brand-dark font-medium px-3 py-1.5 rounded-full text-sm animate-fade-in">
                    <span className="mr-1.5">{ingredientIcons[ing] || '🍲'}</span>
                    {ing}
                    <button onClick={() => removeIngredient(index)} type="button" className="ml-2 text-brand-dark/70 hover:text-brand-dark font-bold text-lg leading-none" aria-label={`Remove ${ing}`}>
                        &times;
                    </button>
                </span>
            ))}
        </div>

        <div className="mb-6">
          <p className="font-semibold text-brand-text mb-2">Popular ingredients:</p>
          <div className="flex flex-wrap gap-2">
            {popularIngredients.map(ing => (
              <button key={ing} type="button" onClick={() => addIngredient(ing)} disabled={isLoading} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-full text-sm transition-colors disabled:opacity-50">
                + {ing}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
            <div>
                <p className="font-semibold text-brand-text mb-3">Dietary Preferences</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {dietaryOptions.map(opt => {
                    const isSelected = dietaryPreference === opt.value;
                    const baseClasses = "w-full flex items-center justify-center p-3 rounded-lg border-2 font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50";
                    const selectedClasses = styleMap[opt.value];
                    const unselectedClasses = "bg-white border-gray-200 text-gray-600 hover:border-gray-400";
                    return (
                        <button key={opt.value} type="button" onClick={() => handleDietarySelect(opt.value)} disabled={isLoading} className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
                            {opt.icon}
                            <span className="truncate text-sm">{opt.name}</span>
                        </button>
                    );
                    })}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <p className="font-semibold text-brand-text mb-3">Cooking Time</p>
                <div className="flex space-x-2">
                  <FilterButton label="< 15m" value="15" currentValue={cookingTime} onClick={setCookingTime} />
                  <FilterButton label="< 30m" value="30" currentValue={cookingTime} onClick={setCookingTime} />
                  <FilterButton label="< 60m" value="60" currentValue={cookingTime} onClick={setCookingTime} />
                </div>
              </div>
              <div>
                <p className="font-semibold text-brand-text mb-3">Difficulty</p>
                <div className="flex space-x-2">
                  <FilterButton label="Easy" value="Easy" currentValue={difficulty} onClick={setDifficulty} />
                  <FilterButton label="Medium" value="Medium" currentValue={difficulty} onClick={setDifficulty} />
                  <FilterButton label="Hard" value="Hard" currentValue={difficulty} onClick={setDifficulty} />
                </div>
              </div>
            </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
            <button
            type="submit"
            className="w-full bg-brand-dark hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isLoading || ingredients.length === 0}
            >
            {isLoading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Finding Recipes...
                </>
            ) : (
                'Find Recipes'
            )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
