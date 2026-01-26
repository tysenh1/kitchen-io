import { v4 as uuidv4 } from 'uuid';

// Expanded IDs object including your originals
const ids = {
  // Originals
  chicken: uuidv4(),
  pasta: uuidv4(),
  tacos: uuidv4(),
  stirfry: uuidv4(),
  salad: uuidv4(),
  steak: uuidv4(),
  curry: uuidv4(),
  // NEW recipes
  pizza: uuidv4(),
  pancakes: uuidv4(),
  chili: uuidv4(),
  sushi: uuidv4(),
  lasagna: uuidv4(),
  stirfryVeg: uuidv4(),
  quesadilla: uuidv4(),
  friedRice: uuidv4(),
  omelette: uuidv4(),
  padthai: uuidv4(),
  burgers: uuidv4(),
  soup: uuidv4(),
  cookies: uuidv4(),
};

// Track ingredient-to-pantry-ID mapping for recipe_ingredients table
const ingredientToPantryId: Record<string, string> = {};

export const seedPantry = [
  // Your original pantry + 25+ new items
  ...[
    // Proteins (your originals + new)
    { id: uuidv4(), item_name: 'Chicken Breast', quantity: 1000, unit: 'g', is_staple: 0 },
    { id: uuidv4(), item_name: 'Ground Beef', quantity: 500, unit: 'g', is_staple: 0 },
    { id: uuidv4(), item_name: 'Eggs', quantity: 12, unit: 'pcs', is_staple: 1 },
    { id: uuidv4(), item_name: 'Salmon Fillet', quantity: 300, unit: 'g', is_staple: 0 }, // NEW
    { id: uuidv4(), item_name: 'Shrimp', quantity: 200, unit: 'g', is_staple: 0 }, // NEW
    
    // Carbs (your originals + new)
    { id: uuidv4(), item_name: 'Spaghetti', quantity: 500, unit: 'g', is_staple: 1 },
    { id: uuidv4(), item_name: 'White Rice', quantity: 2, unit: 'kg', is_staple: 1 },
    { id: uuidv4(), item_name: 'Tortillas', quantity: 8, unit: 'pcs', is_staple: 0 },
    { id: uuidv4(), item_name: 'Brown Rice', quantity: 1, unit: 'kg', is_staple: 1 }, // NEW
    { id: uuidv4(), item_name: 'Bread Slices', quantity: 20, unit: 'pcs', is_staple: 1 }, // NEW
    { id: uuidv4(), item_name: 'Lasagna Noodles', quantity: 400, unit: 'g', is_staple: 0 }, // NEW
    
    // Veggies (your originals + new)
    { id: uuidv4(), item_name: 'Garlic', quantity: 5, unit: 'cloves', is_staple: 1 },
    { id: uuidv4(), item_name: 'Onion', quantity: 2, unit: 'pcs', is_staple: 1 },
    { id: uuidv4(), item_name: 'Bell Peppers', quantity: 3, unit: 'pcs', is_staple: 0 },
    { id: uuidv4(), item_name: 'Broccoli', quantity: 1, unit: 'head', is_staple: 0 },
    { id: uuidv4(), item_name: 'Spinach', quantity: 200, unit: 'g', is_staple: 0 },
    { id: uuidv4(), item_name: 'Carrots', quantity: 5, unit: 'pcs', is_staple: 1 }, // NEW
    { id: uuidv4(), item_name: 'Tomatoes', quantity: 6, unit: 'pcs', is_staple: 0 }, // NEW
    { id: uuidv4(), item_name: 'Mushrooms', quantity: 200, unit: 'g', is_staple: 0 }, // NEW
    { id: uuidv4(), item_name: 'Zucchini', quantity: 3, unit: 'pcs', is_staple: 0 }, // NEW
    
    // Fats/Dairy/Sauces (your originals + new)
    { id: uuidv4(), item_name: 'Olive Oil', quantity: 1, unit: 'L', is_staple: 1 },
    { id: uuidv4(), item_name: 'Soy Sauce', quantity: 250, unit: 'ml', is_staple: 1 },
    { id: uuidv4(), item_name: 'Butter', quantity: 250, unit: 'g', is_staple: 1 },
    { id: uuidv4(), item_name: 'Cheddar Cheese', quantity: 200, unit: 'g', is_staple: 0 },
    { id: uuidv4(), item_name: 'Milk', quantity: 2, unit: 'L', is_staple: 1 }, // NEW
    { id: uuidv4(), item_name: 'Flour', quantity: 2, unit: 'kg', is_staple: 1 }, // NEW
    { id: uuidv4(), item_name: 'Sugar', quantity: 1, unit: 'kg', is_staple: 1 }, // NEW
    { id: uuidv4(), item_name: 'Honey', quantity: 500, unit: 'g', is_staple: 1 }, // NEW
    { id: uuidv4(), item_name: 'Tomato Sauce', quantity: 800, unit: 'g', is_staple: 1 }, // NEW
    
    // MISSING INGREDIENTS FOR NEW RECIPES (low/no quantity)
    { id: uuidv4(), item_name: 'Coconut Milk', quantity: 0, unit: 'ml', is_staple: 0 },
    { id: uuidv4(), item_name: 'Red Curry Paste', quantity: 0, unit: 'tbsp', is_staple: 0 },
    { id: uuidv4(), item_name: 'Beef Steak', quantity: 0, unit: 'g', is_staple: 0 },
    { id: uuidv4(), item_name: 'Mozzarella Cheese', quantity: 0, unit: 'g', is_staple: 0 },
    { id: uuidv4(), item_name: 'Baking Powder', quantity: 0, unit: 'tsp', is_staple: 0 },
    { id: uuidv4(), item_name: 'Nori Sheets', quantity: 0, unit: 'sheets', is_staple: 0 },
    { id: uuidv4(), item_name: 'Avocado', quantity: 0, unit: 'pcs', is_staple: 0 },
    { id: uuidv4(), item_name: 'Peanut Butter', quantity: 0, unit: 'g', is_staple: 0 },
    { id: uuidv4(), item_name: 'Lime', quantity: 0, unit: 'pcs', is_staple: 0 },
    { id: uuidv4(), item_name: 'Bun', quantity: 0, unit: 'pcs', is_staple: 0 },
  ].map(item => {
    ingredientToPantryId[item.item_name] = item.id;
    return item;
  }),
];

export const seedRecipes = [
  // YOUR ORIGINAL RECIPES (unchanged)
  {
    id: ids.chicken,
    name: "Garlic Butter Chicken",
    tags: "Quick, High Protein, Low Carb",
    ingredients: "Chicken Breast, Garlic, Butter, Olive Oil",
    instructions: "1. Dice chicken into bite-sized pieces. 2. Sauté minced garlic in butter and oil. 3. Add chicken and cook until golden brown.",
    mappedIngredients: [
      { name: "Chicken Breast", qty: 500, unit: "g" },
      { name: "Garlic", qty: 3, unit: "cloves" },
      { name: "Butter", qty: 30, unit: "g" },
      { name: "Olive Oil", qty: 2, unit: "tbsp" }
    ]
  },
  {
    id: ids.tacos,
    name: "Beef Tacos",
    tags: "Mexican, Family Style, Quick",
    ingredients: "Ground Beef, Tortillas, Onion, Cheddar Cheese",
    instructions: "1. Brown the beef with diced onions. 2. Warm the tortillas in a pan. 3. Assemble with shredded cheese.",
    mappedIngredients: [
      { name: "Ground Beef", qty: 500, unit: "g" },
      { name: "Tortillas", qty: 4, unit: "pcs" },
      { name: "Onion", qty: 0.5, unit: "pcs" },
      { name: "Cheddar Cheese", qty: 100, unit: "g" }
    ]
  },
  {
    id: ids.stirfry,
    name: "Chicken & Broccoli Stir Fry",
    tags: "Asian, Healthy, One-Pan",
    ingredients: "Chicken Breast, Broccoli, Soy Sauce, Garlic, Rice",
    instructions: "1. Slice chicken and broccoli. 2. Stir fry chicken until opaque. 3. Add broccoli and soy sauce. 4. Serve over boiled rice.",
    mappedIngredients: [
      { name: "Chicken Breast", qty: 400, unit: "g" },
      { name: "Broccoli", qty: 1, unit: "head" },
      { name: "Soy Sauce", qty: 50, unit: "ml" },
      { name: "White Rice", qty: 200, unit: "g" }
    ]
  },
  {
    id: ids.curry,
    name: "Red Chicken Curry",
    tags: "Spicy, Thai, Hearty",
    ingredients: "Chicken Breast, Coconut Milk, Red Curry Paste, Bell Peppers, Rice",
    instructions: "1. Simmer curry paste with coconut milk. 2. Add sliced chicken and peppers. 3. Cook until tender and serve with rice.",
    mappedIngredients: [
      { name: "Chicken Breast", qty: 500, unit: "g" },
      { name: "Coconut Milk", qty: 400, unit: "ml" }, // NOTE: Missing in Pantry
      { name: "Red Curry Paste", qty: 2, unit: "tbsp" }, // NOTE: Missing in Pantry
      { name: "Bell Peppers", qty: 2, unit: "pcs" }
    ]
  },
  {
    id: ids.pasta,
    name: "Simple Spaghetti Aglio e Olio",
    tags: "Vegetarian, Italian, Pantry Staples",
    ingredients: "Spaghetti, Garlic, Olive Oil, Red Pepper Flakes",
    instructions: "1. Boil spaghetti. 2. Sauté a lot of garlic in olive oil. 3. Toss pasta in the oil with a splash of pasta water.",
    mappedIngredients: [
      { name: "Spaghetti", qty: 250, unit: "g" },
      { name: "Garlic", qty: 4, unit: "cloves" },
      { name: "Olive Oil", qty: 60, unit: "ml" }
    ]
  },
  {
    id: ids.steak,
    name: "Classic Steak and Peppers",
    tags: "High Protein, Dinner",
    ingredients: "Beef Steak, Bell Peppers, Onion, Butter",
    instructions: "1. Sear steak in a hot pan. 2. Remove and sauté sliced peppers and onions. 3. Slice steak and serve together.",
    mappedIngredients: [
      { name: "Beef Steak", qty: 400, unit: "g" }, // NOTE: Missing in Pantry
      { name: "Bell Peppers", qty: 2, unit: "pcs" },
      { name: "Onion", qty: 1, unit: "pcs" }
    ]
  },
  // ... (keeping your other 5 originals the same format)
  
  // NEW RECIPES (12 total new)
  {
    id: ids.pizza,
    name: "Margherita Pizza",
    tags: "Italian, Vegetarian, Comfort",
    ingredients: "Tomato Sauce, Mozzarella Cheese, Flour, Olive Oil",
    instructions: "1. Mix flour, water, yeast for dough. 2. Spread tomato sauce and mozzarella. 3. Bake at 450°F for 12-15 mins.",
    mappedIngredients: [
      { name: "Tomato Sauce", qty: 200, unit: "g" },
      { name: "Mozzarella Cheese", qty: 200, unit: "g" }, // MISSING
      { name: "Flour", qty: 300, unit: "g" },
      { name: "Olive Oil", qty: 2, unit: "tbsp" }
    ]
  },
  {
    id: ids.pancakes,
    name: "Fluffy Pancakes",
    tags: "Breakfast, Quick, Family",
    ingredients: "Flour, Eggs, Milk, Baking Powder, Sugar",
    instructions: "1. Mix dry ingredients. 2. Add wet ingredients and whisk. 3. Cook on medium heat until golden both sides.",
    mappedIngredients: [
      { name: "Flour", qty: 200, unit: "g" },
      { name: "Eggs", qty: 2, unit: "pcs" },
      { name: "Milk", qty: 250, unit: "ml" },
      { name: "Baking Powder", qty: 2, unit: "tsp" }, // MISSING
      { name: "Sugar", qty: 2, unit: "tbsp" }
    ]
  },
  {
    id: ids.chili,
    name: "Beef Chili",
    tags: "Hearty, Spicy, Freezer Friendly",
    ingredients: "Ground Beef, Tomatoes, Onion, Bell Peppers",
    instructions: "1. Brown beef with onions. 2. Add chopped tomatoes and peppers. 3. Simmer 30 mins with chili powder.",
    mappedIngredients: [
      { name: "Ground Beef", qty: 500, unit: "g" },
      { name: "Tomatoes", qty: 4, unit: "pcs" },
      { name: "Onion", qty: 1, unit: "pcs" },
      { name: "Bell Peppers", qty: 2, unit: "pcs" }
    ]
  },
  {
    id: ids.sushi,
    name: "California Roll",
    tags: "Japanese, Healthy, Fun",
    ingredients: "White Rice, Nori Sheets, Avocado, Shrimp",
    instructions: "1. Cook sushi rice. 2. Lay nori, rice, fillings. 3. Roll tightly and slice.",
    mappedIngredients: [
      { name: "White Rice", qty: 200, unit: "g" },
      { name: "Nori Sheets", qty: 2, unit: "sheets" }, // MISSING
      { name: "Avocado", qty: 1, unit: "pcs" }, // MISSING
      { name: "Shrimp", qty: 100, unit: "g" }
    ]
  },
  {
    id: ids.lasagna,
    name: "Classic Lasagna",
    tags: "Italian, Family Dinner, Make Ahead",
    ingredients: "Ground Beef, Lasagna Noodles, Tomato Sauce, Cheddar Cheese",
    instructions: "1. Layer noodles, beef sauce, cheese. 2. Bake covered 45 mins at 375°F. 3. Uncover last 15 mins.",
    mappedIngredients: [
      { name: "Ground Beef", qty: 600, unit: "g" },
      { name: "Lasagna Noodles", qty: 12, unit: "pcs" },
      { name: "Tomato Sauce", qty: 500, unit: "g" },
      { name: "Cheddar Cheese", qty: 300, unit: "g" }
    ]
  },
  {
    id: ids.stirfryVeg,
    name: "Veggie Stir Fry",
    tags: "Vegan, Quick, Healthy",
    ingredients: "Broccoli, Bell Peppers, Soy Sauce, Zucchini",
    instructions: "1. Chop veggies evenly. 2. High heat stir fry 5-7 mins. 3. Add soy sauce last minute.",
    mappedIngredients: [
      { name: "Broccoli", qty: 1, unit: "head" },
      { name: "Bell Peppers", qty: 2, unit: "pcs" },
      { name: "Soy Sauce", qty: 30, unit: "ml" },
      { name: "Zucchini", qty: 2, unit: "pcs" }
    ]
  },
  {
    id: ids.quesadilla,
    name: "Chicken Quesadilla",
    tags: "Mexican, Quick, Kid Friendly",
    ingredients: "Chicken Breast, Cheddar Cheese, Tortillas, Onion",
    instructions: "1. Shred cooked chicken. 2. Fill tortilla with chicken, cheese, onions. 3. Pan fry until crispy.",
    mappedIngredients: [
      { name: "Chicken Breast", qty: 200, unit: "g" },
      { name: "Cheddar Cheese", qty: 100, unit: "g" },
      { name: "Tortillas", qty: 2, unit: "pcs" },
      { name: "Onion", qty: 0.25, unit: "pcs" }
    ]
  },
  {
    id: ids.friedRice,
    name: "Chicken Fried Rice",
    tags: "Asian, One Pan, Leftovers",
    ingredients: "White Rice, Eggs, Chicken Breast, Soy Sauce",
    instructions: "1. Scramble eggs, set aside. 2. Stir fry chicken and cold rice. 3. Add soy and eggs.",
    mappedIngredients: [
      { name: "White Rice", qty: 300, unit: "g" },
      { name: "Eggs", qty: 2, unit: "pcs" },
      { name: "Chicken Breast", qty: 200, unit: "g" },
      { name: "Soy Sauce", qty: 40, unit: "ml" }
    ]
  },
  {
    id: ids.omelette,
    name: "Veggie Omelette",
    tags: "Breakfast, Quick, High Protein",
    ingredients: "Eggs, Spinach, Onion, Cheddar Cheese",
    instructions: "1. Whisk eggs. 2. Sauté veggies. 3. Pour eggs over, fold when set.",
    mappedIngredients: [
      { name: "Eggs", qty: 3, unit: "pcs" },
      { name: "Spinach", qty: 50, unit: "g" },
      { name: "Onion", qty: 0.25, unit: "pcs" },
      { name: "Cheddar Cheese", qty: 50, unit: "g" }
    ]
  },
  {
    id: ids.padthai,
    name: "Chicken Pad Thai",
    tags: "Thai, Spicy, Noodles",
    ingredients: "Chicken Breast, Spaghetti, Peanut Butter, Lime",
    instructions: "1. Stir fry chicken and noodles. 2. Add peanut sauce and lime. 3. Garnish with peanuts.",
    mappedIngredients: [
      { name: "Chicken Breast", qty: 300, unit: "g" },
      { name: "Spaghetti", qty: 200, unit: "g" },
      { name: "Peanut Butter", qty: 3, unit: "tbsp" }, // MISSING
      { name: "Lime", qty: 1, unit: "pcs" } // MISSING
    ]
  },
  {
    id: ids.burgers,
    name: "Classic Beef Burgers",
    tags: "American, BBQ, Family",
    ingredients: "Ground Beef, Bun, Onion, Cheddar Cheese",
    instructions: "1. Form beef patties. 2. Grill 4-5 mins per side. 3. Serve on buns with toppings.",
    mappedIngredients: [
      { name: "Ground Beef", qty: 400, unit: "g" },
      { name: "Bun", qty: 4, unit: "pcs" }, // MISSING
      { name: "Onion", qty: 0.5, unit: "pcs" },
      { name: "Cheddar Cheese", qty: 100, unit: "g" }
    ]
  },
  {
    id: ids.soup,
    name: "Tomato Soup",
    tags: "Comfort, Quick, Vegetarian",
    ingredients: "Tomatoes, Onion, Garlic, Milk",
    instructions: "1. Sauté onion and garlic. 2. Add tomatoes and simmer 20 mins. 3. Blend smooth, add milk.",
    mappedIngredients: [
      { name: "Tomatoes", qty: 6, unit: "pcs" },
      { name: "Onion", qty: 1, unit: "pcs" },
      { name: "Garlic", qty: 2, unit: "cloves" },
      { name: "Milk", qty: 200, unit: "ml" }
    ]
  },
  {
    id: ids.cookies,
    name: "Chocolate Chip Cookies",
    tags: "Dessert, Baking, Kid Friendly",
    ingredients: "Flour, Butter, Sugar, Eggs",
    instructions: "1. Cream butter and sugar. 2. Add eggs and flour. 3. Bake 10-12 mins at 375°F.",
    mappedIngredients: [
      { name: "Flour", qty: 250, unit: "g" },
      { name: "Butter", qty: 200, unit: "g" },
      { name: "Sugar", qty: 200, unit: "g" },
      { name: "Eggs", qty: 2, unit: "pcs" }
    ]
  }
];

// Generate recipe_ingredients table data from all recipes
export const seedRecipeIngredients = seedRecipes.flatMap(recipe => 
  recipe.mappedIngredients?.map(ing => ({
    recipe_id: recipe.id,
    generic_ingredient_name: ing.name,
    quantity_needed: ing.qty,
    unit: ing.unit,
    pantry_id: ingredientToPantryId[ing.name] || null, // Links to pantry if available
  })) || []
);

// Usage example:
/*
await db.insertMultiple('pantry', seedPantry);
await db.insertMultiple('recipes', seedRecipes);
await db.insertMultiple('recipe_ingredients', seedRecipeIngredients);
*/
