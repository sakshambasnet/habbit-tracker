
import { useState } from "react";
import { Task, TaskStatus, WeekDay } from "@/types";
import { useTaskContext } from "@/contexts/TaskContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clock, XCircle, AlertCircle, Trash2, Edit, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { updateTaskStatus, deleteTask, updateTask } = useTaskContext();
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  
  // Edit state
  const [editName, setEditName] = useState(task.name);
  const [editDescription, setEditDescription] = useState(task.description || "");
  const [editDueDate, setEditDueDate] = useState(
    new Date(task.dueDate).toISOString().split('T')[0]
  );
  const [editWeekDay, setEditWeekDay] = useState<WeekDay | undefined>(
    task.weekDay
  );

  const handleStatusChange = (status: TaskStatus) => {
    if (status === "not-started") {
      setReasonDialogOpen(true);
    } else {
      updateTaskStatus(task.id, status);
    }
  };

  const handleReasonSubmit = () => {
    if (reason.trim()) {
      updateTaskStatus(task.id, "not-started", reason);
      setReasonDialogOpen(false);
      setReason("");
    }
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
  };

  const handleEditSubmit = () => {
    if (editName.trim()) {
      // Calculate new due date based on week day for weekly tasks
      let newDueDate = new Date(`${editDueDate}T${new Date().toTimeString().split(' ')[0]}`);
      
      if (task.goalType === "weekly" && editWeekDay) {
        const daysOfWeek: Record<WeekDay, number> = {
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6,
          sunday: 0
        };
        
        const currentDay = newDueDate.getDay();
        const targetDay = daysOfWeek[editWeekDay];
        
        // Calculate days to add
        let daysToAdd = targetDay - currentDay;
        if (daysToAdd <= 0) {
          // If target day is today or already passed this week, add days until next week
          daysToAdd += 7;
        }
        
        newDueDate.setDate(newDueDate.getDate() + daysToAdd);
      }
      
      updateTask({
        ...task,
        name: editName,
        description: editDescription.trim() || undefined,
        dueDate: newDueDate,
        weekDay: task.goalType === "weekly" ? editWeekDay : undefined,
      });
      setEditDialogOpen(false);
    }
  };

  // Format due date
  const formatDueDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="task-card animate-fade-in">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-lg">{task.name}</h3>
          {task.description && (
            <p className="text-muted-foreground text-sm mt-1">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Due: {formatDueDate(task.dueDate)}</span>
            </div>
            
            {task.goalType === "weekly" && task.weekDay && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{capitalizeFirstLetter(task.weekDay)}</span>
              </div>
            )}
          </div>

          {task.reason && (
            <div className="mt-2 text-sm p-2 bg-muted rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-muted-foreground">{task.reason}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className={`status-btn ${
                task.status === "complete" ? "status-complete" : ""
              }`}
              onClick={() => handleStatusChange("complete")}
            >
              <Check className="h-4 w-4 mr-1" />
              Done
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={`status-btn ${
                task.status === "in-progress" ? "status-progress" : ""
              }`}
              onClick={() => handleStatusChange("in-progress")}
            >
              <Clock className="h-4 w-4 mr-1" />
              In Progress
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={`status-btn ${
                task.status === "not-started" ? "status-notstarted" : ""
              }`}
              onClick={() => handleStatusChange("not-started")}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Not Started
            </Button>
          </div>
          <div className="flex gap-2 justify-end">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={handleDeleteTask}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Reason Dialog */}
      <Dialog open={reasonDialogOpen} onOpenChange={setReasonDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Why haven't you started this task?</DialogTitle>
            <DialogDescription>
              Please provide a reason why you couldn't start this task. This helps us analyze your patterns.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Textarea
              placeholder="Enter your reason here..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReasonDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleReasonSubmit} disabled={!reason.trim()}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task details below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="taskName" className="text-sm font-medium">Task Name</label>
              <Input
                id="taskName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter task name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="taskDescription" className="text-sm font-medium">Description (optional)</label>
              <Textarea
                id="taskDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Enter task description"
              />
            </div>
            
            {task.goalType === "daily" ? (
              <div className="space-y-2">
                <label htmlFor="taskDueDate" className="text-sm font-medium">Due Date</label>
                <Input
                  id="taskDueDate"
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="taskWeekDay" className="text-sm font-medium">Day of Week</label>
                <Select 
                  value={editWeekDay} 
                  onValueChange={(value) => setEditWeekDay(value as WeekDay)}
                >
                  <SelectTrigger id="taskWeekDay">
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={!editName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskItem;
