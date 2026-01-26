export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface ServerToClientEvents {
  ai_stream: (token: string) => void;
  agent_status: (status: string) => void;
  stream_done: () => void;
  error: (msg: string) => void;
}

export interface ClientToServerEvents {
  user_msg: (message: string) => void;
}
