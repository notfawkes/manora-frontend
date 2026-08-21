export interface TimelineTask {
  task_id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
}

export interface CreateTaskPayload {
  user_id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  start_time: string; // ISO string with time
  end_time: string; // ISO string with time
}

export interface TimelineEvent {
  time: string;
  event: string;
  likely_effect: string;
}

export interface PredictionResponse {
  scenario: {
    task_id: string;
    decision: string;
    reason: string;
  };
  baseline: {
    description: string;
    confidence: number;
  };
  events: TimelineEvent[];
  summary: string;
}
