import ollama from 'ollama';
import type { Message, Tool, ChatResponse } from 'ollama';
import { toolsLogic, toolDefinitions } from './toolService.ts'; // Move your tools here
import type { LLMResponse } from '../types.ts';

const MODEL = 'qwen2.5:7b-instruct-q4_K_M';

export const generateAiResponse = async (history: Message[]): Promise<LLMResponse> => {
  let response = await ollama.chat({
    model: MODEL,
    messages: history,
    tools: toolDefinitions,
    format: 'json',
    options: { temperature: 0.1 }
  });

  // Check if the model wants to use a tool
  if (isToolCall(response.message.content)) {
    const content = JSON.parse(response.message.content);
    response = await handleToolCall(content.name, content.arguments, history);
  }

  return JSON.parse(response.message.content);
};

// Helper to determine if the string is a tool call
function isToolCall(content: string): boolean {
  try {
    const parsed = JSON.parse(content);
    return !!(parsed.name && parsed.arguments);
  } catch {
    return false;
  }
}

// Recursive function to handle tool execution and follow-up
async function handleToolCall(name: string, args: any, history: Message[]): Promise<ChatResponse> {
  const func = toolsLogic[name as keyof typeof toolsLogic];
  if (!func) throw new Error(`Unknown tool: ${name}`);

  // Execute the tool logic (from your db queries)
  const toolData = await func(args);

  history.push({ role: 'tool', content: JSON.stringify(toolData) });

  // Get a new response from the AI now that it has the tool data
  const response = await ollama.chat({
    model: MODEL,
    messages: history,
    tools: toolDefinitions,
    format: 'json',
    options: { temperature: 0.1 }
  });

  if (isToolCall(response.message.content)) {
    const nextCall = JSON.parse(response.message.content);
    return handleToolCall(nextCall.name, nextCall.arguments, history);
  }

  return response;
}
