export type TaskType = 'TASK_1' | 'TASK_2';

export type FormalLevel = 'Formal' | 'Semi-formal';

export interface Task1State {
  promptText: string;
  recipient: string;
  formality: FormalLevel;
  questions: string[]; // 3-4 items

  // Plan
  opening: string;
  whoAmI: string;
  whyWriting: string;
  bodyStructure: string[]; // First, Second, etc.
  cta: string;
  pleaseLetMeKnow: string;
  signOff: string;

  // Writing
  content: string;
}

export interface Task2Point {
  point: string;
  reason: string;
  example: string;
}

export interface Task2State {
  promptText: string;
  audience: string;
  providedArgs: string[];
  position: 'A_FAVOR' | 'CONTRA';
  topic: string;

  // Plan
  opinionLine: string;
  points: Task2Point[]; // 3 blocks

  // Writing
  content: string;
}

export type FeedbackSeverity = 'BLOCKER' | 'IMPORTANT' | 'POLISH';

export interface FeedbackItem {
  id: string;
  message: string;
  severity: FeedbackSeverity;
  passed: boolean;
}

export interface SessionStats {
  lastWordCount: number;
  lastTask: TaskType;
  date: string;
}
