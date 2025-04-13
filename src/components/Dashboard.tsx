
import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { GoalType } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddTaskForm from "./AddTaskForm";
import TaskList from "./TaskList";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { selectedGoalType, setSelectedGoalType, isLoading } = useTaskContext();

  const handleTabChange = (value: string) => {
    setSelectedGoalType(value as GoalType);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
          <Skeleton className="h-12 w-full max-w-md" />
          <div className="space-y-4 mt-6">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <AddTaskForm />
        </div>

        <Tabs
          defaultValue={selectedGoalType}
          value={selectedGoalType}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="daily" className="animate-pulse">Daily Goals</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Goals</TabsTrigger>
          </TabsList>
          <TabsContent value="daily" className="mt-6 animate-fade-in">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Today's Tasks</h3>
              </div>
              <TaskList goalType="daily" />
            </div>
          </TabsContent>
          <TabsContent value="weekly" className="mt-6 animate-fade-in">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">This Week's Tasks</h3>
              </div>
              <TaskList goalType="weekly" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
