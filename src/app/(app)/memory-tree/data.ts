export interface MemoryNodeGoal {
  id: string;
  title: string;
}

export interface MemoryNodeData {
  id: string;
  title: string;
  category: string;
  frequency: string;
  averageIntensity: string;
  recentExperience: string;
  contexts: string[];
  goals: MemoryNodeGoal[];
}

export const memoryTreeData: Record<string, MemoryNodeData> = {
  "flower-1": {
    id: "flower-1",
    title: "Angry Memories",
    category: "Anger",
    frequency: "14 times",
    averageIntensity: "78%",
    recentExperience: "19th Aug",
    contexts: [
      "Study avoidance",
      "Placement pressure",
      "Plans",
      "Study memories",
      "Study memories",
    ],
    goals: [
      { id: "g1", title: "Get a good placement" },
      { id: "g2", title: "Become an AI Engineer" },
    ],
  },
  "flower-2": {
    id: "flower-2",
    title: "Anxious Memories",
    category: "Anxiety",
    frequency: "11 times",
    averageIntensity: "65%",
    recentExperience: "18th Aug",
    contexts: [
      "Exam deadlines",
      "Project submission",
      "Future uncertainty",
      "Public speaking",
    ],
    goals: [
      { id: "g3", title: "Practice mindfulness" },
      { id: "g4", title: "Master system design" },
    ],
  },
  "flower-3": {
    id: "flower-3",
    title: "Joyful Memories",
    category: "Joy",
    frequency: "24 times",
    averageIntensity: "89%",
    recentExperience: "17th Aug",
    contexts: [
      "Hackathon victory",
      "Team celebration",
      "Weekend hangout",
      "New project launch",
    ],
    goals: [
      { id: "g5", title: "Build impactful AI apps" },
      { id: "g6", title: "Maintain work-life balance" },
    ],
  },
  "flower-4": {
    id: "flower-4",
    title: "Calm & Mindful",
    category: "Calm",
    frequency: "16 times",
    averageIntensity: "52%",
    recentExperience: "16th Aug",
    contexts: [
      "Evening walk",
      "Deep coding flow",
      "Morning coffee",
      "Reading research",
    ],
    goals: [
      { id: "g7", title: "Read 1 paper weekly" },
      { id: "g8", title: "Daily meditation habit" },
    ],
  },
  "flower-5": {
    id: "flower-5",
    title: "Proud Milestones",
    category: "Pride",
    frequency: "12 times",
    averageIntensity: "84%",
    recentExperience: "15th Aug",
    contexts: [
      "SIH Grand Finale",
      "First open source PR",
      "Mentoring juniors",
      "Solved hard bug",
    ],
    goals: [
      { id: "g9", title: "Crack top tech interview" },
      { id: "g10", title: "Publish research paper" },
    ],
  },
  "flower-6": {
    id: "flower-6",
    title: "Grateful Memories",
    category: "Gratitude",
    frequency: "18 times",
    averageIntensity: "72%",
    recentExperience: "14th Aug",
    contexts: [
      "Peer support",
      "Family dinner",
      "Mentor feedback",
      "Healthy recovery",
    ],
    goals: [
      { id: "g11", title: "Give back to community" },
      { id: "g12", title: "Stay grateful daily" },
    ],
  },
  "flower-7": {
    id: "flower-7",
    title: "Sad Memories",
    category: "Sadness",
    frequency: "8 times",
    averageIntensity: "60%",
    recentExperience: "12th Aug",
    contexts: [
      "Missed opportunity",
      "Burnout feeling",
      "Homesick",
      "Rejection email",
    ],
    goals: [
      { id: "g13", title: "Build emotional resilience" },
      { id: "g14", title: "Bounce back stronger" },
    ],
  },
};
