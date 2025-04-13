
import { Task, GoalType, TaskStatus } from "@/types";

// Function to get today's date at 11:59 PM
const getTodayEndTime = () => {
  const today = new Date();
  today.setHours(23, 59, 0, 0);
  return today;
};

// Function to get the end of current week (Sunday 11:59 PM)
const getWeekEndTime = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = day === 0 ? 0 : 7 - day; // If today is Sunday, end time is today
  
  const endOfWeek = new Date();
  endOfWeek.setDate(today.getDate() + diff);
  endOfWeek.setHours(23, 59, 0, 0);
  
  return endOfWeek;
};

// Generate a random ID for mock data
const generateId = () => Math.random().toString(36).substring(2, 11);

// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: generateId(),
    name: "Morning meditation",
    description: "10 minutes of mindfulness practice",
    status: "in-progress",
    goalType: "daily",
    dueDate: getTodayEndTime(),
    createdAt: new Date(),
  },
  {
    id: generateId(),
    name: "Complete workout routine",
    description: "30 minutes cardio, 20 minutes strength",
    status: "not-started",
    goalType: "daily",
    dueDate: getTodayEndTime(),
    createdAt: new Date(),
  },
  {
    id: generateId(),
    name: "Read 20 pages",
    description: "Continue with current book",
    status: "complete",
    goalType: "daily",
    dueDate: getTodayEndTime(),
    createdAt: new Date(),
  },
  {
    id: generateId(),
    name: "Finish coding project",
    description: "Complete the React component library",
    status: "in-progress",
    goalType: "weekly",
    dueDate: getWeekEndTime(),
    createdAt: new Date(),
  },
  {
    id: generateId(),
    name: "Plan meals for the week",
    description: "Create shopping list and meal prep plan",
    status: "complete",
    goalType: "weekly",
    dueDate: getWeekEndTime(),
    createdAt: new Date(),
  }
];
