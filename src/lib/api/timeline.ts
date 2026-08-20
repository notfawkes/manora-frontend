import { BACKEND_URL } from "./interaction";
import { CreateTaskPayload, PredictionResponse, TimelineTask } from "@/types/timeline";

export async function fetchTasks(userId: string, date?: string): Promise<TimelineTask[]> {
  try {
    const queryDate = date || new Date().toISOString().split("T")[0];
    const res = await fetch(`${BACKEND_URL}/alternate-timeline/tasks/${userId}?date=${queryDate}`);
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
    console.log("createTask payload being sent:", JSON.stringify(payload));
    const res = await fetch(`${BACKEND_URL}/alternate-timeline/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.error("createTask failed:", res.status, errBody);
    }
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
