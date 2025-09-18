export interface Recipe {
  title: string;
  ingredients: string[];
  steps: string[];
  time: string;
  description: string;
  imageUrl?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}
