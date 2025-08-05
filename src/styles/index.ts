export interface User {
  _id: string;
  username: string;
  password: string;
  challengeStartDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Journal {
  _id: string;
  userId: string;
  date: string;
  note: string;
  mood: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  text: string;
  checked: boolean;
}

export interface Checklist {
  _id: string;
  userId: string;
  date: string;
  category: string; 
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Streak {
  _id: string;
  userId: string;
  currentStreak: number;
  bestStreak: number;
  relapseCount: number;
  createdAt: string;
  updatedAt: string;
  lastDate: string;
}

export interface Milestone {
  _id: string;
  userId: string;
  milestoneDay: number;
  note: string;
  createdAt: string;
  updatedAt: string;
}
