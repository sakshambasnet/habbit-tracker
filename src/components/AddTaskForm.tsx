
import { useState, useEffect } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Task, GoalType, WeekDay } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const AddTaskForm = () => {
  const { selectedGoalType, addTask } = useTaskContext();
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedDay, setSelectedDay] = useState<WeekDay>("monday");

  // Function to get end of day or end of selected day in week
  const getDueDate = (goalType: GoalType, weekDay?: WeekDay): Date => {
    const date = new Date();
    
    if (goalType === "daily") {
      // Set to 11:59 PM today
      date.setHours(23, 59, 0, 0);
    } else {
      // For weekly tasks, set due date based on selected day
      const daysOfWeek: Record<WeekDay, number> = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 0
      };
      
      const today = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const targetDay = daysOfWeek[weekDay || "sunday"];
      
      // Calculate days to add
      let daysToAdd = targetDay - today;
      if (daysToAdd <= 0) {
        // If target day is today or already passed this week, add days until next week
        daysToAdd += 7;
      }
      
      date.setDate(date.getDate() + daysToAdd);
      date.setHours(23, 59, 0, 0);
    }
    
    return date;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim()) return;
    
    const newTask: Omit<Task, "id" | "createdAt"> = {
      name: taskName.trim(),
      description: taskDescription.trim() || undefined,
      status: "not-started",
      goalType: selectedGoalType,
      dueDate: getDueDate(selectedGoalType, selectedGoalType === "weekly" ? selectedDay : undefined),
    };
    
    // Add weekDay property only for weekly tasks
    if (selectedGoalType === "weekly") {
      newTask.weekDay = selectedDay;
    }
    
    addTask(newTask);
    
    // Reset form
    setTaskName("");
    setTaskDescription("");
    setSelectedDay("monday");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New {selectedGoalType === "daily" ? "Daily" : "Weekly"} Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label htmlFor="task-name" className="text-sm font-medium">
              Task Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="task-name"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="task-description" className="text-sm font-medium">
              Description (Optional)
            </label>
            <Textarea
              id="task-description"
              placeholder="Describe your task (optional)"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>
          
          {selectedGoalType === "weekly" && (
            <div className="space-y-2">
              <label htmlFor="task-day" className="text-sm font-medium">
                Day of Week <span className="text-destructive">*</span>
              </label>
              <Select value={selectedDay} onValueChange={(value) => setSelectedDay(value as WeekDay)}>
                <SelectTrigger id="task-day" className="w-full">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!taskName.trim()}>
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskForm;
