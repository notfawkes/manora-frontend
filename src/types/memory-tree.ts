export interface MemoryNodeResponse {
  emotion: string;
  memory_count: number;
}

export interface EmotionMemory {
  memory_id: string;
  content: string;
  importance: number;
  confidence: number;
}

export interface EmotionMemoriesResponse {
  emotion: string;
  memories: EmotionMemory[];
}

export interface ReflectionResponse {
  emotion: string;
  memories: EmotionMemory[];
  reflection: {
    summary: string;
    contributing_factors: string[];
  };
}
