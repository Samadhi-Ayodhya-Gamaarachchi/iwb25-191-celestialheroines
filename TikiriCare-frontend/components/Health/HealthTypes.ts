export interface ChildData {
  name: string;
  age: string;
  lastCheckup: string;
  height: number;
  heightChange: string;
  weight: number;
  weightChange: string;
  bmi: number;
  bmiStatus: string;
}

export interface Vaccine {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  urgent: boolean;
}

export interface MedicalRecord {
  id: number;
  type: string;
  date: string;
  doctor: string;
  notes: string;
  status: 'completed' | 'recovered' | 'ongoing';
  emoji: string;
}

export interface Tab {
  name: string;
  emoji: string;
}

export type TabName = 'Growth' | 'Vaccines' | 'Records';
