import {
  BuddyExpression,
  BuddyResponse,
  BuddyState,
  InteractionRequest,
  InteractionResponse,
} from "@/types/interaction";

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

/**
 * Normalizes backend expression names to supported SVG expression identifiers
 */
export function mapBackendExpression(
  rawExpression?: string | null
): BuddyExpression | null {
  if (!rawExpression) return null;

  const normalized = rawExpression.trim().toLowerCase();

  switch (normalized) {
    case "neutral":
      return "neutral";
    case "happy":
    case "happiness":
    case "joy":
      return "happy";
    case "sad":
    case "sadness":
      return "sad";
    case "concerned":
    case "concern":
      return "concern";
    case "frustrated":
    case "frustration":
    case "frustation":
      return "frustation";
    case "energetic":
    case "energy":
      return "energy";
    case "warm":
    case "warmth":
      return "warmth";
    default:
      return null;
  }
}

/**
 * State-based fallback mechanism when buddy.expression is missing or unknown.
 * Priority order:
 * 1. concern
 * 2. frustration
 * 3. sadness
 * 4. happiness
 * 5. warmth
 * 6. energy
 * 7. neutral
 */
export function determineFallbackExpression(
  buddyState?: BuddyState | null,
  threshold: number = 0.6
): BuddyExpression {
  if (!buddyState) return "neutral";

  if (buddyState.concern >= threshold) {
    return "concern";
  }
  if (buddyState.frustration >= threshold) {
    return "frustation";
  }
  if (buddyState.sadness >= threshold) {
    return "sad";
  }
  if (buddyState.happiness >= threshold) {
    return "happy";
  }
  if (buddyState.warmth >= threshold) {
    return "warmth";
  }
  if (buddyState.energy >= threshold) {
    return "energy";
  }

  return "neutral";
}

/**
 * Resolves final BuddyExpression following backend priority:
 * 1. Primary: buddy.expression
 * 2. Fallback: buddy_state analysis
 * 3. Default: neutral
 */
export function resolveBuddyExpression(
  buddy?: BuddyResponse | null,
  buddyState?: BuddyState | null
): BuddyExpression {
  const mapped = mapBackendExpression(buddy?.expression);
  if (mapped) {
    return mapped;
  }
  return determineFallbackExpression(buddyState);
}

/**
 * Sends user interaction to the FastAPI backend
 */
export async function sendInteraction(
  text: string,
  userId: string,
  sessionId: string,
  signal?: AbortSignal
): Promise<InteractionResponse> {
  const payload: InteractionRequest = {
    user_id: userId,
    session_id: sessionId,
    text,
  };

  const response = await fetch(`${BACKEND_URL}/interactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    let errorDetails = "";
    try {
      const errorJson = await response.json();
      errorDetails = errorJson.detail || JSON.stringify(errorJson);
    } catch {
      errorDetails = response.statusText;
    }
    throw new Error(
      `Backend error (${response.status}): ${errorDetails || "Request failed"}`
    );
  }

  const data: InteractionResponse = await response.json();
  return data;
}
