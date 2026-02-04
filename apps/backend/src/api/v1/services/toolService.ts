import { db } from '../config/db.ts';
import type { KitchenTools, RecipeBase } from '../types.ts';
import type { Tool } from 'ollama';
export const toolsLogic: KitchenTools = {
  // getPantry: async () => {
  //   return new Promise((resolve) => {
  //     db.all("SELECT item_name, quantity, unit FROM pantry WHERE quantity > 0;", (err, rows) => {
  //       console.log("PANTRY", rows)
  //       resolve(JSON.stringify(rows || "Pantry is empty."))
  //     });
  //   });
  // },
  browseAllRecipes: async () => {
    return new Promise((resolve) => {
      db.all(`
        SELECT 
  r.id, 
  r.name, 
  r.tags
FROM recipes r
JOIN recipe_ingredients ri ON r.id = ri.recipe_id
JOIN pantry p ON ri.ingredient_id = p.id
GROUP BY r.id, r.name, r.tags
HAVING 
  COUNT(*) = SUM(
    CASE 
      WHEN p.quantity > 0 AND p.quantity >= ri.quantity_needed 
      THEN 1 
      ELSE 0 
    END
  );`, [], (err, rows: RecipeBase) => {
        if (err) resolve(`Error accessiong database: ${err}`)
        resolve(JSON.stringify(rows))
      })
    })
  },

  getRecipeDetails: async ({ recipe_id }) => {
    return new Promise((resolve) => {
      const query = `
  SELECT 
    r.id, r.name, r.instructions, r.ingredients, r.tags,
    GROUP_CONCAT(ri.generic_ingredient_name || ':' || 
                 ri.quantity_needed || ' ' || ri.unit, '; ') 
    AS detailed_ingredients
  FROM recipes r
  LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
  WHERE r.id = ?
  GROUP BY r.id, r.name, r.instructions, r.ingredients, r.tags
`;
      db.get(query, [recipe_id], (err, row) => {
        console.log(err)
        resolve(JSON.stringify(row || { error: "Recipe not found in database." }));
      });
    });
  }
}

export const toolDefinitions: Tool[] = [
  // {
  //   type: 'function',
  //   function: {
  //     name: 'getPantry',
  //     description: 'Call this FIRST to see what ingredients are available.',
  //     parameters: {
  //       type: 'object',
  //       properties: {},
  //       required: []
  //     }
  //   }
  // },
  {
    type: 'function',
    function: {
      name: 'browseAllRecipes',
      description: 'Returns a list of all recipe names/tags. Use this to find what to cook.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getRecipeDetails',
      description: "Get full instructions. ONLY use this if you already have a recipe ID.",
      parameters: {
        type: 'object',
        properties: {
          recipe_id: {
            type: 'string',
            description: "The UUID of the recipe"
          }
        },
        required: ['recipe_id']
      }
    }
  }
];
