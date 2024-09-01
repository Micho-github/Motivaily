import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trash2,
  ChevronUp,
  ChevronDown,
  Info,
  // Eye,
  // EyeOff,
} from "lucide-react";
import TaskItem from "./TaskItem";
import AddTaskDialog from "./AddTaskDialog";
import InfoDialog from "./InfoDialog";
import TaskCelebration from "./TaskCelebration";
import { TodoList as TodoListType, Task } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import DueDateWarning from "./DueDateWarning";

interface TodoListProps {
  list: TodoListType;
  onDelete: (id: number) => void;
  onUpdate: (list: TodoListType) => void;
  onMove: (id: number, direction: "up" | "down") => void;
  onAddTask: (
    listId: number,
    title: string,
    description: string,
    dueDate: string | null
  ) => void;
  onToggleTask: (listId: number, taskId: number) => void;
  onDeleteTask: (listId: number, taskId: number) => void;
  onToggleListVisibility: (listId: number) => void;
  onToggleTaskVisibility: (listId: number, taskId: number) => void;
  isFirst: boolean;
  isLast: boolean;
  showHidden: boolean;
}

export default function TodoList({
  list,
  onDelete,
  onUpdate,
  onMove,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  // onToggleListVisibility,
  onToggleTaskVisibility,
  isFirst,
  isLast,
  showHidden,
}: TodoListProps) {
  const [hideCompletedTasks, setHideCompletedTasks] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { toast } = useToast();

  const visibleTasks = list.tasks.filter(
    (task) => !hideCompletedTasks || (!task.completed && !task.hidden)
  );

  const handleUpdateListDueDate = (newDueDate: string | null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (newDueDate) {
      const dueDate = new Date(newDueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        toast({
          title: "Invalid Due Date",
          description:
            "Due date cannot be in the past. Please select a future date.",
          variant: "destructive",
        });
        return;
      }
    }

    onUpdate({ ...list, dueDate: newDueDate });
  };

  const handleMoveTask = (taskId: number, direction: "up" | "down") => {
    const taskIndex = list.tasks.findIndex((task) => task.id === taskId);
    if (
      (direction === "up" && taskIndex > 0) ||
      (direction === "down" && taskIndex < list.tasks.length - 1)
    ) {
      const newTasks = [...list.tasks];
      const temp = newTasks[taskIndex];
      newTasks[taskIndex] = newTasks[taskIndex + (direction === "up" ? -1 : 1)];
      newTasks[taskIndex + (direction === "up" ? -1 : 1)] = temp;
      onUpdate({ ...list, tasks: newTasks });
    }
  };

  const handleToggleTask = (taskId: number) => {
    onToggleTask(list.id, taskId);
    const task = list.tasks.find((t) => t.id === taskId);
    if (task && !task.completed) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  return (
    <Card
      className={`border-primary/20 ${
        list.hidden ? "opacity-60" : ""
      } relative`}
    >
      {showCelebration && <TaskCelebration listId={list.id} />}
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-primary text-lg sm:text-xl">
          <span className="truncate mr-2 text-secondary">{list.title}</span>
          <div className="flex items-center">
            <Button
              className="bg-transparent"
              onClick={() => setShowInfoDialog(true)}
            >
              <Info className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onMove(list.id, "up")}
              disabled={isFirst}
              className="text-primary hover:text-primary-foreground bg-transparent"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => onMove(list.id, "down")}
              disabled={isLast}
              className="text-primary hover:text-primary-foreground bg-transparent"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            {/* <Button
              onClick={() => onToggleListVisibility(list.id)}
              className="text-primary hover:text-primary-foreground bg-transparent"
            >
              {list.hidden ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button> */}
            <Button
              onClick={() => onDelete(list.id)}
              className="text-destructive hover:text-destructive-foreground bg-transparent hover:bg-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <div className="text-xs sm:text-sm text-muted-foreground">
          Priority: {list.priority}
          {list.dueDate && (
            <>
              {" | "}
              <DueDateWarning dueDate={list.dueDate} type="list" />
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setHideCompletedTasks(!hideCompletedTasks)}
          className={cn(
            "text-primary border-primary hover:bg-primary hover:text-primary-foreground",
            hideCompletedTasks &&
              "bg-secondary border-secondary hover:bg-secondary-hover text-white -mb-5"
          )}
        >
          {hideCompletedTasks ? "Show All Tasks" : "Hide Completed Tasks"}
        </Button>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={() => handleToggleTask(task.id)}
              onDelete={() => onDeleteTask(list.id, task.id)}
              onToggleVisibility={() =>
                onToggleTaskVisibility(list.id, task.id)
              }
              onMove={(direction) => handleMoveTask(task.id, direction)}
              onUpdateDueDate={(newDueDate) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (newDueDate) {
                  const dueDate = new Date(newDueDate);
                  dueDate.setHours(0, 0, 0, 0);

                  if (dueDate < today) {
                    toast({
                      title: "Invalid Due Date",
                      description:
                        "Due date cannot be in the past. Please select a future date.",
                      variant: "destructive",
                    });
                    return;
                  }

                  if (list.dueDate && dueDate > new Date(list.dueDate)) {
                    toast({
                      title: "Invalid Due Date",
                      description:
                        "Task due date cannot be later than the list due date.",
                      variant: "destructive",
                    });
                    return;
                  }
                }

                const updatedTasks = list.tasks.map((t) =>
                  t.id === task.id ? { ...t, dueDate: newDueDate } : t
                );
                onUpdate({ ...list, tasks: updatedTasks });
              }}
            />
          ))}
        </ul>
        <Button
          onClick={() => setShowAddTaskDialog(true)}
          className="mt-4 bg-secondary border-secondary hover:bg-secondary-hover text-white"
        >
          Add Task
        </Button>
      </CardContent>
      <AddTaskDialog
        isOpen={showAddTaskDialog}
        onClose={() => setShowAddTaskDialog(false)}
        onAddTask={(title, description, dueDate) => {
          if (
            dueDate &&
            list.dueDate &&
            new Date(dueDate) > new Date(list.dueDate)
          ) {
            toast({
              title: "Invalid Due Date",
              description:
                "Task due date cannot be later than the list due date.",
              variant: "destructive",
            });
            return;
          }
          onAddTask(list.id, title, description, dueDate);
        }}
        listTitle={list.title}
        listDueDate={list.dueDate ?? ""}
      />
      <InfoDialog
        isOpen={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        title={list.title}
        description={list.description}
        dueDate={list.dueDate}
        onUpdateDueDate={handleUpdateListDueDate}
      />
    </Card>
  );
}
