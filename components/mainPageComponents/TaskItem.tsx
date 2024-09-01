import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Trash2,
  ChevronUp,
  ChevronDown,
  Info,
  EyeOff,
  Eye,
} from "lucide-react";
import { Task } from "@/types";
import InfoDialog from "./InfoDialog";
import DueDateWarning from "./DueDateWarning";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
  onMove: (direction: "up" | "down") => void;
  onUpdateDueDate: (newDueDate: string | null) => void;
}

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onToggleVisibility,
  onMove,
  onUpdateDueDate,
}: TaskItemProps) {
  const [showInfoDialog, setShowInfoDialog] = useState(false);

  return (
    <>
      <li className={`flex items-center ${task.hidden ? "opacity-60" : ""}`}>
        <Checkbox checked={task.completed} onCheckedChange={onToggle} />
        <span
          className={`truncate max-w-[150px] mx-1 ${
            task.completed ? "line-through" : ""
          }`}
          title={task.title}
        >
          {task.title}
        </span>
        <DueDateWarning dueDate={task.dueDate} type="task" />
        <Button
          className="bg-transparent -ml-3 -mr-1"
          onClick={() => setShowInfoDialog(true)}
        >
          <Info className="h-4 w-4" />
        </Button>
        <Button className="bg-transparent -mx-3" onClick={() => onMove("up")}>
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button className="bg-transparent -mx-3" onClick={() => onMove("down")}>
          <ChevronDown className="h-4 w-4" />
        </Button>
        {/* <Button variant="ghost" size="icon" onClick={onToggleVisibility}>
          {task.hidden ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button> */}
        <Button
          className="hover:text-destructive-foreground bg-transparent hover:bg-destructive -ml-1 "
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </li>
      <InfoDialog
        isOpen={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        title={task.title}
        description={task.description}
        dueDate={task.dueDate}
        onUpdateDueDate={onUpdateDueDate}
      />
    </>
  );
}
