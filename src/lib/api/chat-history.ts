import { BACKEND_URL } from "./interaction";

export interface ChatSession {
  id: string;
  title: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatSessionResponse {
  user_id: string;
  sessions: ChatSession[];
  count: number;
  limit: number;
  offset: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "buddy";
  text: string;
  created_at: string;
}

export interface ChatSessionDetailsResponse {
  user_id: string;
  session_id: string;
  messages: ChatMessage[];
  count: number;
  limit: number;
  offset: number;
}

export async function fetchSessions(userId: string): Promise<ChatSession[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/chat-history/${userId}/sessions`);
    if (!res.ok) throw new Error("Failed to fetch sessions");
    const data: ChatSessionResponse = await res.json();
    return data.sessions || [];
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return [];
  }
}

export async function fetchSessionMessages(userId: string, sessionId: string): Promise<ChatMessage[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/chat-history/${userId}/sessions/${sessionId}`);
    if (!res.ok) throw new Error("Failed to fetch session messages");
    const data: ChatSessionDetailsResponse = await res.json();
    return data.messages || [];
  } catch (error) {
    console.error("Error fetching session messages:", error);
    return [];
  }
}
