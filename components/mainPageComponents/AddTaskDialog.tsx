import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (
    title: string,
    description: string,
    dueDate: string | null
  ) => void;
  listTitle: string;
  listDueDate: string;
}

export default function AddTaskDialog({
  isOpen,
  onClose,
  onAddTask,
  listTitle,
  listDueDate,
}: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [hasDueDate, setHasDueDate] = useState(false);

  const handleSubmit = () => {
    if (title.trim()) {
      const formattedDueDate = hasDueDate ? dueDate : null;

      // Ensure dueDate is not later than the list's dueDate
      if (
        formattedDueDate &&
        new Date(formattedDueDate) > new Date(listDueDate)
      ) {
        alert("Due date cannot be later than the list's due date.");
        return;
      }

      // Ensure formattedDueDate is in the expected format if needed
      onAddTask(title.trim(), description.trim(), formattedDueDate);
      setTitle("");
      setDescription("");
      setDueDate("");
      setHasDueDate(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Task to {listTitle}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hasDueDate"
              checked={hasDueDate}
              onCheckedChange={(checked) => setHasDueDate(checked as boolean)}
            />
            <Label htmlFor="hasDueDate">Set due date</Label>
          </div>
          {hasDueDate && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                max={listDueDate}
                className="col-span-3"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-secondary border-secondary hover:bg-secondary-hover text-white"
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
