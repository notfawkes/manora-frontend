export interface FlowerCoordinate {
  id: string;
  label: string;
  emotion: string; // Corresponds to the backend emotion identifier
  x: number; // percentage (0 - 100) from left of the tree container
  y: number; // percentage (0 - 100) from top of the tree container
  size?: number; // relative size percentage (default ~7.5%)
  animationDelay?: string;
}

export const flowerCoordinates: FlowerCoordinate[] = [
  {
    id: "flower-1",
    label: "Angry memories",
    emotion: "angry",
    x: 53.5,
    y: 11.8,
    size: 7.8,
    animationDelay: "0s",
  },
  {
    id: "flower-2",
    label: "Anxious memories",
    emotion: "anxious",
    x: 42.6,
    y: 22.8,
    size: 7.2,
    animationDelay: "0.4s",
  },
  {
    id: "flower-3",
    label: "Joyful Memories",
    emotion: "happy",
    x: 68.8,
    y: 30.8,
    size: 7.5,
    animationDelay: "0.8s",
  },
  {
    id: "flower-4",
    label: "Calm Memories",
    emotion: "calm",
    x: 30.2,
    y: 33.8,
    size: 7.2,
    animationDelay: "0.2s",
  },
  {
    id: "flower-7",
    label: "Sad memories",
    emotion: "sad",
    x: 25.0,
    y: 57.2,
    size: 7.2,
    animationDelay: "0.5s",
  },
];
