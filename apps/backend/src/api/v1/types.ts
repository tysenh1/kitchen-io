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

export interface OFFResponse {
  code: string;
  status: number;
  status_verbose: string;
  product: OFFProductResponse;
}

export interface OFFProductResponse {
  allergens?: string;
  allergens_tags?: string[];
  categories_heirarchy?: string[];
  categories_tags?: string[];
  generic_name?: string;
  generic_name_en?: string;
  image_small_url?: string;
  image_url?: string;
  product_name?: string;
  product_name_en?: string;
  product_quantity?: number;
  product_quantity_unit?: string;
  quantity?: string;
  product_quantity_string?: string;
  net_weight_unit?: string;
}
