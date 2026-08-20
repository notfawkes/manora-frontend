import { BACKEND_URL } from "./interaction";
import { MemoryNodeResponse, EmotionMemoriesResponse, ReflectionResponse } from "@/types/memory-tree";

export async function getMemoryNodes(userId: string): Promise<MemoryNodeResponse[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/memory-tree/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch memory nodes");
    const data = await res.json();
    return data.nodes || [];
  } catch (error) {
    console.error("Error fetching memory nodes:", error);
    return [];
  }
}

export async function getEmotionMemories(userId: string, emotion: string): Promise<EmotionMemoriesResponse | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/memory-tree/${userId}/emotions/${emotion}`);
    if (!res.ok) throw new Error("Failed to fetch emotion memories");
    return await res.json();
  } catch (error) {
    console.error("Error fetching emotion memories:", error);
    return null;
  }
}

export async function getReflection(userId: string, emotion: string): Promise<ReflectionResponse | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/memory-tree/${userId}/reflect?emotion=${emotion}`);
    if (!res.ok) throw new Error("Failed to fetch reflection");
    return await res.json();
  } catch (error) {
    console.error("Error fetching reflection:", error);
    return null;
  }
}
