import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: {
    dueDateOrder: "asc" | "desc" | null;
    priority: string[];
    dueDate: Date | null;
  };
  onApplyFilters: (filters: {
    priority: string[];
    dueDate: Date | null;
    dueDateOrder: "asc" | "desc" | null;
  }) => void;
}

export default function FilterModal({
  isOpen,
  onClose,
  currentFilters,
  onApplyFilters,
}: FilterModalProps) {
  const [priority, setPriority] = useState<string[]>(currentFilters.priority);
  const [dueDateOrder, setDueDateOrder] = useState<"asc" | "desc" | null>(
    currentFilters.dueDateOrder
  );

  useEffect(() => {
    setPriority(currentFilters.priority);
    setDueDateOrder(currentFilters.dueDateOrder);
  }, [currentFilters]);

  const handlePriorityChange = (value: string) => {
    setPriority((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      priority,
      dueDateOrder,
      dueDate: null,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Tasks</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <div className="col-span-3 space-y-2">
              {["Low", "Medium", "High", "Critical"].map((p) => (
                <div key={p} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${p}`}
                    checked={priority.includes(p)}
                    onCheckedChange={() => handlePriorityChange(p)}
                  />
                  <Label htmlFor={`priority-${p}`}>{p}</Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDateOrder" className="text-right">
              Due Date Order
            </Label>
            <Select
              value={dueDateOrder || "no_order"}
              onValueChange={(value: "asc" | "desc" | "no_order") =>
                setDueDateOrder(value === "no_order" ? null : value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_order">No order</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
