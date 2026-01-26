import sqlite3 from 'sqlite3';
import { seedPantry, seedRecipes, seedRecipeIngredients } from './seedData.ts';
import path from 'path';
import fs from 'fs';

const db = new sqlite3.Database('./kitchen.db');

// ✅ FIXED: Import seedRecipeIngredients from your seedData.ts
const schemaPath = '/home/tysenh1/Coding/kitchenio/apps/backend/schema.sql';
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

const runImport = () => {
  db.serialize(() => {
    console.log('🔄 Starting database seeding...');
    
    // 1. Drop and recreate tables
    db.run('DROP TABLE IF EXISTS recipe_ingredients');
    db.run('DROP TABLE IF EXISTS recipes');
    db.run('DROP TABLE IF EXISTS pantry');
    
    // 2. ✅ FIXED: Execute schema FIRST (creates tables)
    db.exec(schemaSql);
    
    // 3. Insert Pantry
    const pantryStmt = db.prepare("INSERT INTO pantry (id, item_name, quantity, unit, is_staple) VALUES (?, ?, ?, ?, ?)");
    seedPantry.forEach(item => {
      pantryStmt.run(item.id, item.item_name, item.quantity, item.unit, item.is_staple);
    });
    pantryStmt.finalize();

    // 4. Insert Recipes
    const recipeStmt = db.prepare("INSERT INTO recipes (id, name, instructions, ingredients, tags) VALUES (?, ?, ?, ?, ?)");
    seedRecipes.forEach(recipe => {
      recipeStmt.run(recipe.id, recipe.name, recipe.instructions, recipe.ingredients, recipe.tags);
    });
    recipeStmt.finalize();

    // 5. ✅ FIXED: Use seedRecipeIngredients array directly
    const ingredientStmt = db.prepare("INSERT INTO recipe_ingredients (recipe_id, generic_ingredient_name, quantity_needed, unit) VALUES (?, ?, ?, ?)");
    seedRecipeIngredients.forEach(ing => {
      ingredientStmt.run(ing.recipe_id, ing.generic_ingredient_name, ing.quantity_needed, ing.unit);
    });
    ingredientStmt.finalize();

    console.log("✅ Database seeded successfully!");
    console.log(`📦 Pantry items: ${seedPantry.length}`);
    console.log(`🍳 Recipes: ${seedRecipes.length}`);
    console.log(`🔗 Recipe ingredients: ${seedRecipeIngredients.length}`);
  });

  db.close((err) => {
    if (err) {
      console.error('❌ Error closing DB:', err.message);
    } else {
      console.log('🔒 Database connection closed.');
    }
  });
};

runImport();
