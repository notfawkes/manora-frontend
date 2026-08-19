export interface FlowerCoordinate {
  id: string;
  label: string;
  x: number; // percentage (0 - 100) from left of the tree container
  y: number; // percentage (0 - 100) from top of the tree container
  size?: number; // relative size percentage (default ~7.5%)
  animationDelay?: string;
}

export const flowerCoordinates: FlowerCoordinate[] = [
  {
    id: "flower-1",
    label: "Angry memories",
    x: 53.5,
    y: 11.8,
    size: 7.8,
    animationDelay: "0s",
  },
  {
    id: "flower-2",
    label: "Anxious memories",
    x: 42.6,
    y: 22.8,
    size: 7.2,
    animationDelay: "0.4s",
  },
  {
    id: "flower-3",
    label: "Joyful Memories",
    x: 68.8,
    y: 30.8,
    size: 7.5,
    animationDelay: "0.8s",
  },
  {
    id: "flower-4",
    label: "Calm Memories",
    x: 30.2,
    y: 33.8,
    size: 7.2,
    animationDelay: "0.2s",
  },
  {
    id: "flower-5",
    label: "Proud memories",
    x: 59.4,
    y: 40.8,
    size: 7.5,
    animationDelay: "0.6s",
  },
  {
    id: "flower-6",
    label: "Grateful Memories",
    x: 75.8,
    y: 44.8,
    size: 7.0,
    animationDelay: "1.0s",
  },
  {
    id: "flower-7",
    label: "Sad memories",
    x: 25.0,
    y: 57.2,
    size: 7.2,
    animationDelay: "0.5s",
  },
];
