export type BuddyExpression =
  | "neutral"
  | "happy"
  | "sad"
  | "concern"
  | "frustation"
  | "energy"
  | "warmth";

export interface InteractionRequest {
  user_id: string;
  session_id: string;
  text: string;
}

export interface EmotionItem {
  emotion: string;
  intensity: number;
  confidence: number;
  source: string;
}

export interface GoalRelevance {
  related: boolean;
  goal: string;
}

export interface EmotionResponse {
  interaction_id?: string;
  primary_emotion?: string;
  emotions?: EmotionItem[];
  emotional_summary?: string;
  behavioral_signals?: string[];
  decision_signals?: string[];
  goal_relevance?: GoalRelevance;
}

export interface BuddyState {
  happiness: number;
  sadness: number;
  frustration: number;
  concern: number;
  warmth: number;
  patience: number;
  energy: number;
}

export interface BuddyResponse {
  text: string;
  expression: string;
  intensity: number;
  response_type?: string;
}

export interface InteractionResponse {
  interaction_id: string;
  emotion: EmotionResponse;
  buddy_state: BuddyState;
  buddy: BuddyResponse;
}
