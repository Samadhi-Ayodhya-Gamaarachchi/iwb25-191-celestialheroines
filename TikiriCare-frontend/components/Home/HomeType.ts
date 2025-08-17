export interface ChildData {
  name: string;
  age: string;
  lastCheckup: string;
  height: number;
  weight: number;
  bmi: number;
  developmentScore: number;
}

export interface DevelopmentMilestone {
  category: string;
  progress: number;
  color: string;
  emoji: string;
}

export interface Vaccine {
  id: number;
  name: string;
  dueDate: string;
  urgent: boolean;
  emoji: string;
}

export interface CareTip {
  id: number;
  title: string;
  tip: string;
  emoji: string;
  category: string;
}

export interface SummaryItem {
  emoji: string;
  label: string;
  value: string;
}