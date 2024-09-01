import React from "react";
import { cn } from "@/lib/utils";

interface DueDateWarningProps {
  dueDate: string | null;
  type: "list" | "task";
}

export default function DueDateWarning({ dueDate, type }: DueDateWarningProps) {
  if (!dueDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDateObj = new Date(dueDate);
  dueDateObj.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(
    (dueDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  let warningClass = "";
  if (diffDays < 0) {
    warningClass = "text-red-500 border-red-500";
  } else if (diffDays === 0) {
    warningClass = "text-yellow-500 border-yellow-500";
  } else if (diffDays <= 3) {
    warningClass = "text-green-500 border-green-500";
  }

  return (
    <span
      className={cn(
        "text-xs font-medium px-2 py-1 rounded-full border",
        warningClass,
        type === "list" ? "bg-background" : "bg-muted"
      )}
    >
      {diffDays < 0
        ? "Past due"
        : diffDays === 0
        ? "Due today"
        : `Due in ${diffDays} days`}
    </span>
  );
}
