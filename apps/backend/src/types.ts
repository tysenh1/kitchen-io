export interface PantryItem {
  item_name: string;
  quantity: number;
  unit: string;
  is_staple?: boolean;
}

export interface RecipeBase {
  id: string;
  name: string;
  tags: string;
}

export interface RecipeFull extends RecipeBase {
  instructions: string;
  ingredients?: string;
}

export interface KitchenTools {
  // getPantry: () => Promise<string>;
  browseAllRecipes: (args: { tags?: string, keywords?: string }) => Promise<string>;
  getRecipeDetails: (args: { recipe_id: any }) => Promise<string>;
}

export interface LLMResponse {
  thought_process: string,
  flag: string,
  message: string,
  recipe_id: string | null,
  reset_context: boolean
}

