import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const recipeSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "The name of the recipe.",
      },
      description: {
        type: Type.STRING,
        description: "A short, appetizing description of the dish, max 20 words.",
      },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "A list of all ingredients required for the recipe.",
      },
      steps: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "The step-by-step instructions to prepare the dish.",
      },
      time: {
        type: Type.STRING,
        description: "The estimated total time to prepare and cook, e.g., '45 minutes'.",
      },
      difficulty: {
        type: Type.STRING,
        description: "The difficulty level of the recipe. Must be one of: Easy, Medium, or Hard.",
      },
    },
    required: ["title", "description", "ingredients", "steps", "time", "difficulty"],
  },
};

// Helper function to retry API calls with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries - 1;
      const isRetryableError = error?.status === 'UNAVAILABLE' || error?.code === 503;
      
      if (isLastAttempt || !isRetryableError) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`API overloaded, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

export const findRecipes = async (
  ingredients: string, 
  dietaryPreference: string, 
  cookingTime: string, 
  difficulty: string
): Promise<Recipe[]> => {
  const dietaryInstruction = dietaryPreference === 'none' ? '' : `The user has a dietary preference for ${dietaryPreference} food.`;
  const timeInstruction = cookingTime === 'any' ? '' : `The recipe must take less than ${cookingTime} minutes to prepare and cook.`;
  const difficultyInstruction = difficulty === 'any' ? '' : `The recipe must have a difficulty level of '${difficulty}'.`;

  const prompt = `
    You are an expert chef. Based on the following ingredients: ${ingredients}, generate 3 to 5 creative recipe ideas.
    ${dietaryInstruction}
    ${timeInstruction}
    ${difficultyInstruction}
    For each recipe, provide a title, a short appetizing description, a list of ingredients, step-by-step instructions, the estimated total time, and a difficulty rating (Easy, Medium, or Hard).
    Ensure the recipes primarily use the provided ingredients, but you can include common pantry staples like oil, salt, pepper, and water.
  `;

  try {
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: recipeSchema,
        },
      });
    });

    const recipes: Recipe[] = JSON.parse(response.text);

    // Generate images for each recipe using Gemini AI with retry logic
    const recipesWithImages = await Promise.all(
      recipes.map(async (recipe) => {
        try {
          const imageResponse = await retryWithBackoff(async () => {
            return await ai.models.generateImages({
              model: 'imagen-4.0-generate-001',
              prompt: `A beautiful, professional food photography shot of ${recipe.title}. ${recipe.description}. The dish is elegantly presented on a clean, modern plate with natural lighting. High-quality, appetizing, restaurant-style presentation.`,
              config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
              },
            });
          });

          if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
            const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
            return {
              ...recipe,
              imageUrl: `data:image/jpeg;base64,${base64ImageBytes}`,
            };
          }
        } catch (imageError) {
          console.error(`Failed to generate image for ${recipe.title}:`, imageError);
        }
        // Fallback to placeholder if image generation fails
        return { ...recipe, imageUrl: `https://picsum.photos/seed/${encodeURIComponent(recipe.title)}/800/450` };
      })
    );

    return recipesWithImages;
  } catch (error: any) {
    console.error("Error generating recipes:", error);
    
    // Provide more specific error messages
    if (error?.status === 'UNAVAILABLE' || error?.code === 503) {
      throw new Error("The AI service is currently overloaded. Please try again in a few moments.");
    } else if (error?.code === 400) {
      throw new Error("Invalid request. Please check your search criteria and try again.");
    } else if (error?.code === 401 || error?.code === 403) {
      throw new Error("API authentication failed. Please check your API key configuration.");
    } else {
      throw new Error("Failed to generate recipes. Please try again later.");
    }
  }
};
