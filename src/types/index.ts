
export type TaskStatus = 'not-started' | 'in-progress' | 'complete';

export type GoalType = 'daily' | 'weekly';

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  goalType: GoalType;
  dueDate: Date;
  createdAt: Date;
  reason?: string;
  isValidReason?: boolean;
  weekDay?: WeekDay;
}

export interface User {
  id: string;
  email: string;
  name: string;
  settings: UserSettings;
}

export interface UserSettings {
  sarcasmLevel: 'mild' | 'medium' | 'spicy';
  emailNotifications: boolean;
}

// Add this interface to map between our app types and database schema
export interface TaskDbMapping {
  id: string;
  name: string;
  description?: string;
  status: string;
  goal_type: string;
  due_date: string;
  created_at: string;
  reason?: string;
  is_valid_reason?: boolean;
  week_day?: string;
  user_id: string;
}

// New blog interfaces
export interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface BlogDbMapping {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}
