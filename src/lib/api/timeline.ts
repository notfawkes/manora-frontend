import { BACKEND_URL } from "./interaction";
import { CreateTaskPayload, PredictionResponse, TimelineTask } from "@/types/timeline";

export async function fetchTasks(userId: string): Promise<TimelineTask[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/alternate-timeline/tasks/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const data = await res.json();
    return data.tasks || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function createTask(payload: CreateTaskPayload): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/alternate-timeline/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (error) {
    console.error("Error creating task:", error);
    return false;
  }
}

export async function predictTimeline(userId: string, taskId: string, scenario: string = "complete"): Promise<PredictionResponse | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/alternate-timeline/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        task_id: taskId,
        scenario,
      }),
    });
    if (!res.ok) throw new Error("Failed to predict timeline");
    return await res.json();
  } catch (error) {
    console.error("Error predicting timeline:", error);
    return null;
  }
}
