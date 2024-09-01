import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  dueDate: string | null;
  onUpdateDueDate: (newDueDate: string | null) => void;
}

export default function InfoDialog({
  isOpen,
  onClose,
  title,
  description,
  dueDate,
  onUpdateDueDate,
}: InfoDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate || ""}
              onChange={(e) => onUpdateDueDate(e.target.value || null)}
              className="col-span-3"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
