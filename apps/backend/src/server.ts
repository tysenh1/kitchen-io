import express from 'express';
import sqlite3 from 'sqlite3';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ollama from 'ollama';
import type { ChatResponse, Message, Tool } from 'ollama';
import type { PantryItem, RecipeBase, RecipeFull, KitchenTools, LLMResponse } from './types.ts';

// const SYSTEM_PROMPT: Message = {
//   role: 'system',
//   content: `
// You are a kitchen logic controller. Your job is to help the user figure out which recipe they should cook for their meal based on what is available in the pantry, and what kind of meal they are looking to have. To do this, you have access to the following tool functions you must use:
//
// 1. getPantry: This is the function you call to determine what ingredients the user has in their kitchen to use for cooking.
// 2. browseAllRecipes: This is the function you will call after you have an idea of what the user wants to eat. It returns a list of the id, name and tags of all the recipes in the db.
// 3. getRecipeDetails: This is the function you will call once the user agrees on a recipe. It returns the full details of the recipe and is retrieved from the db using like evaluations for the name of the recipe against recipe names and tags.
//
// Every turn you make MUST follow this sequence:
// 1. Check if the required data (pantry/recipes) is in the current context.
// 2. If NOT, you are FORBIDDEN from generating a message. You must instead call the appropriate tool.
// 3. Each turn must end with a message response in json, and the json message must be sent last in the sequence.
//
// No guessing. If it's not in the database, it doesn't exist.
//
// ### MANDATORY PROTOCOL:
// 1. You must only reference the information you get from the tool functions, but you can use other information from your training data for reasoning when deciding which recipes to show the user.
// 2. You are FORBIDDEN from suggesting any recipes until the 'getRecipes' tool function is called and can only suggest recipes based on the output.
// 3. If there are no suitable recipes returned from the 'getRecipes' tool function, your ONLY allowed response is: {"flag": "NO_MATCH", "message": "I don't have any recipes for that.", "reset_context": true}
//
// When you have finished calling tools and have a final answer, respond ONLY in this JSON format:
// {
//   "thought_process": "Briefly explain why you are choosing this path based on tool results.",
//   "flag": "SUCCESS" | "NO_MATCH",
//   "message": "Friendly response to user",
//   "recipe_id": "NAME_OR_NULL",
//   "reset_context": boolean
// }
// `
// }

const SYSTEM_PROMPT: Message = {
  role: 'system',
  content: `You are Chef-OS, a friendly kitchen assistant. Guide users conversationally to pick a recipe.

## CONVERSATION FLOW:
1. **START**: "What are you feeling like today? Italian? Spicy? Quick dinner?"
2. **CLARIFY**: If vague → ask 1-2 specific questions before suggesting
3. **SUGGEST**: When clear → recommend 2-3 recipes with ID's from memory/database context

## NO TOOLS UNTIL READY - Ask questions first, suggest recipes conversationally

Don't include the IDs in any of the messages sent to the user.
When the user decides on a recipe, you MUST send the FULL ingredients list and FULL instructions list that MUST be formatted as markdown in the message field of the json below with a short message.

## MANDATORY FINAL JSON FORMAT (when suggesting recipes):
{
  "thought_process": "Brief reasoning why these recipes match user request + pantry",
  "flag": "SUCCESS",
  "message": "Friendly conversational response with recipe suggestions. This should be in markdown format.", 
  "recipe_id": null | "ID_NUMBER",
  "reset_context": false
}

Example:
{
  "thought_process": "User wants Mexican + has tomatoes/onions → Taco Bowl and Quesadillas match",
  "flag": "SUCCESS", 
  "message": "Perfect! With your pantry I recommend **Taco Bowl (ID:5)** or **Quick Quesadillas (ID:8)**. Which sounds better?",
  "recipe_id": null,
  "reset_context": false
}`
};


const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const db = new sqlite3.Database('./kitchen.db');

app.use(express.json());

app.get('/', (req, res) => {
  res.json('yooo')
})

const toolsLogic: KitchenTools = {
  getPantry: async () => {
    return new Promise((resolve) => {
      db.all("SELECT item_name, quantity, unit FROM pantry", (err, rows) => {
        console.log("PANTRY", rows)
        resolve(JSON.stringify(rows || "Pantry is empty."))
      });
    });
  },
  browseAllRecipes: async () => {
    return new Promise((resolve) => {
      db.all("SELECT id, name, tags FROM recipes", [], (err, rows: RecipeBase) => {
        console.log("RECIPES", rows)
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
        console.log("RECIPE ID", recipe_id);
        console.log("RECIPE DETAILS", row)
        resolve(JSON.stringify(row || { error: "Recipe not found in database." }));
      });
    });
  }
}

const toolDefinitions: Tool[] = [
  {
    type: 'function',
    function: {
      name: 'getPantry',
      description: 'Call this FIRST to see what ingredients are available.',
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

// async function runAgentLoop(socket, history) {
//   const response = await ollama.chat({
//     model: 'llama3.1:8b',
//     messages: history,
//     tools: toolDefinitions,
//     // format: 'json', // Forces Qwen to strictly follow the JSON schema
//     options: { temperature: 0.1 }
//   });
//
//   console.log("RESPONSEEEEEEEEEEEEEE:", response)
//
//   // console.log("AI MESSAGE:", response.message.content)
//   // console.log("TOOL CALLS:", response.message.tool_calls)
//
//   try {
//     const parsed = JSON.parse(response.message.content);
//
//     if (parsed.reset_context === true || parsed.flag === "NO_MATCH") {
//       console.log("🧹 Flag received: Resetting history to prevent context pollution.");
//
//       history.length = 0;
//       historyPush(history, SYSTEM_PROMPT)
//
//       historyPush(history, { role: 'user', content: 'The previous search failed. Lets start over. What else can I make?' })
//     }
//
//     socket.emit('ai_stream', parsed.message);
//     socket.emit('stream_done');
//
//   } catch (e) {
//     console.error("AI failed to send valid JSON", e);
//     socket.emit('error', "Logic Error: AI went off-script.");
//   }
// }

function historyPush(currentHistory: Message[], newMessage: Message) {
  currentHistory.push(newMessage);
  if (currentHistory.length > 6) {
    currentHistory.shift();
  }
  console.log(currentHistory)
  // return [...currentHistory];
}

io.on('connection', (socket) => {
  console.log('Frontend connected');
  let history: Message[] = [SYSTEM_PROMPT];

  const startConversation = async () => {
    socket.emit('ai_stream', "Hey there! 👋 What are you feeling like cooking today? Italian? Something spicy? Quick and easy?");
    socket.emit('stream_done');
  };

  startConversation();

  socket.on('user_msg', async (userText) => {
    historyPush(history, { role: 'user', content: userText });

    try {
      let response = await ollama.chat({
        model: 'llama3.1:8b',
        messages: history,
        tools: toolDefinitions,
        format: 'json',
        options: {
          temperature: 0.1,
          // num_predict: 100
        }
      });

      while (response.message.tool_calls && response.message.tool_calls.length > 0) {
        historyPush(history, response.message)

        for (const tool of response.message.tool_calls) {
          const fnName = tool.function.name as keyof KitchenTools;
          const args = tool.function.arguments as any;

          socket.emit('agent_status', `EXECUTING: ${fnName}`);

          const result = await (toolsLogic[fnName] as any)(args);

          historyPush(history, { role: 'tool', content: result })
        }

        response = await ollama.chat({
          model: 'llama3.1:8b',
          messages: history,
          tools: toolDefinitions,
          format: 'json',
          options: {
            temperature: 0.1,
            // num_predict: 100
          }
        });
      }
      const content: LLMResponse = JSON.parse(response.message.content)

      socket.emit('ai_stream', content.message);
      socket.emit('stream_done');
      historyPush(history, response.message)

    } catch (err) {
      console.error(err);
      socket.emit('error', 'Brain freeze! (kill me)')
    }
  })
  // socket.on('user_msg', async (userText) => {
  //   historyPush(history, { role: 'user', content: userText });
  //
  //   while (true) {  // Infinite loop until no tools
  //     const response = await ollama.chat({
  //       model: 'llama3.1:8b',  // Better model
  //       messages: history,
  //       tools: toolDefinitions,
  //       options: { temperature: 0.1 }
  //     });
  //
  //     console.log('TOOLS?', response.message.tool_calls);
  //
  //     if (!response.message.tool_calls?.length) {
  //       // No tools = final answer
  //       socket.emit('ai_stream', response.message.content);
  //       socket.emit('stream_done');
  //       break;
  //     }
  //
  //     // Execute tools
  //     historyPush(history, response.message);
  //     for (const tool of response.message.tool_calls) {
  //       const result = await toolsLogic[tool.function.name](tool.function.arguments);
  //       historyPush(history, { role: 'tool', content: result });
  //       socket.emit('agent_status', `Got ${tool.function.name} data`);
  //     }
  //   }
  // });
})

server.listen(3001, () => console.log('Backend running on port 3001'))
