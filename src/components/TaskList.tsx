
import { useTaskContext } from "@/contexts/TaskContext";
import TaskItem from "./TaskItem";
import { GoalType } from "@/types";

interface TaskListProps {
  goalType: GoalType;
}

const TaskList = ({ goalType }: TaskListProps) => {
  const { getTasks } = useTaskContext();
  const tasks = getTasks(goalType);

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/30 rounded-lg border border-dashed border-border">
        <p className="text-muted-foreground">
          No {goalType} tasks yet. Add a new task to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
