import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Task, TaskStatus, GoalType, WeekDay } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

interface TaskContextType {
  tasks: Task[];
  selectedGoalType: GoalType;
  setSelectedGoalType: (type: GoalType) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "isValidReason">) => void;
  updateTaskStatus: (id: string, status: TaskStatus, reason?: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (task: Task) => void;
  getTasks: (goalType: GoalType) => Task[];
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [selectedGoalType, setSelectedGoalType] = useState<GoalType>("daily");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query for fetching tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) {
        toast({
          title: "Error fetching tasks",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data.map(task => ({
        id: task.id,
        name: task.name,
        description: task.description || undefined,
        status: task.status as TaskStatus,
        goalType: task.goal_type as GoalType,
        dueDate: new Date(task.due_date),
        createdAt: new Date(task.created_at),
        reason: task.reason || undefined,
        isValidReason: task.is_valid_reason,
        weekDay: task.week_day as WeekDay || undefined,
      }));
    },
    enabled: !!user,
  });

  // Mutation for adding a task
  const addTaskMutation = useMutation({
    mutationFn: async (taskData: Omit<Task, "id" | "createdAt" | "isValidReason">) => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          name: taskData.name,
          description: taskData.description,
          status: taskData.status,
          goal_type: taskData.goalType,
          due_date: taskData.dueDate.toISOString(),
          reason: taskData.reason,
          week_day: taskData.weekDay || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for updating a task status
  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: TaskStatus; reason?: string }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({
          status,
          reason,
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for deleting a task
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
      toast({
        title: "Task deleted",
        description: "Your task has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation for updating a task
  const updateTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({
          name: task.name,
          description: task.description,
          due_date: task.dueDate.toISOString(),
          week_day: task.weekDay || null,
        })
        .eq("id", task.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", user?.id] });
      toast({
        title: "Task updated",
        description: "Your task has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getTasks = (goalType: GoalType) => {
    return tasks.filter((task) => task.goalType === goalType);
  };

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "isValidReason">) => {
    addTaskMutation.mutate(taskData);
    
    toast({
      title: "Task added!",
      description: `${taskData.name} has been added to your ${taskData.goalType} tasks.`,
    });
  };

  const updateTaskStatus = (id: string, status: TaskStatus, reason?: string) => {
    updateTaskStatusMutation.mutate({ id, status, reason });
    
    // Show different messages based on the status
    if (status === "complete") {
      toast({
        title: "Great job! 🎉",
        description: "You've completed a task! Keep up the good work!",
        variant: "default",
      });
      
      // Simulate confetti for completed tasks
      triggerConfetti();
    } else if (status === "in-progress") {
      toast({
        title: "Keep going! 💪",
        description: "You're making progress. You've got this!",
        variant: "default",
      });
    }
  };

  const deleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const updateTask = (task: Task) => {
    updateTaskMutation.mutate(task);
  };

  // Function to trigger confetti animation
  const triggerConfetti = () => {
    const confettiCount = 50;
    const container = document.body;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random position, color, and animation delay
        const left = Math.random() * 100;
        const colors = ['#9b87f5', '#4ade80', '#fbbf24', '#f87171', '#60a5fa'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        confetti.style.left = `${left}vw`;
        confetti.style.top = '-10px';
        confetti.style.backgroundColor = color;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        
        container.appendChild(confetti);
        
        // Remove confetti element after animation
        setTimeout(() => {
          container.removeChild(confetti);
        }, 2000);
      }, i * 50);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: tasks || [],
        selectedGoalType,
        setSelectedGoalType,
        addTask,
        updateTaskStatus,
        deleteTask,
        updateTask,
        getTasks,
        isLoading,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
