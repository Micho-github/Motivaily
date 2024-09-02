"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Menu, EyeOff, Eye, Filter, LayoutGrid } from "lucide-react";
import Header from "@/components/mainPageComponents/Header";
import Footer from "@/components/mainPageComponents/Footer";
import TodoList from "@/components/mainPageComponents/TodoList";
import FilterModal from "@/components/mainPageComponents/FilterModal";
import { TodoList as TodoListType, Task } from "@/types";
import Celebration from "@/components/mainPageComponents/Celebration";
import AddListDialog from "@/components/mainPageComponents/AddListDialog";
import ConfirmDialog from "@/components/mainPageComponents/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Index() {
  const [user,SetUser]=React.useState<Boolean>(false);
  const router =useRouter();
  const supabase = createClient();
  React.useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return router.push("/home");
      }
      SetUser(true);
    };
    checkUser();
  }, [supabase, router]);


  const [lists, setLists] = useState<TodoListType[]>([]);
  const [completedLists, setCompletedLists] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: string;
    id: number | null;
    listId: number | null;
  }>({
    isOpen: false,
    type: "",
    id: null,
    listId: null,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showHidden, setShowHidden] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<{
    priority: string[];
    dueDate: Date | null;
    dueDateOrder: "asc" | "desc" | null;
  }>({
    priority: [],
    dueDate: null,
    dueDateOrder: null,
  });
  const { toast } = useToast();

  const addList = useCallback(
    (newList: Omit<TodoListType, "id" | "tasks">) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (newList.dueDate) {
        const dueDate = new Date(newList.dueDate);
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

      setLists((prevLists) => [
        ...prevLists,
        { ...newList, id: Date.now(), tasks: [] },
      ]);
    },
    [toast]
  );

  const deleteList = useCallback((id: number) => {
    setConfirmDelete({ isOpen: true, type: "list", id, listId: null });
  }, []);

  const updateList = useCallback((updatedList: TodoListType) => {
    setLists((prevLists) =>
      prevLists.map((list) => (list.id === updatedList.id ? updatedList : list))
    );
  }, []);

  const moveList = useCallback((id: number, direction: "up" | "down") => {
    setLists((prevLists) => {
      const index = prevLists.findIndex((list) => list.id === id);
      if (
        (direction === "up" && index > 0) ||
        (direction === "down" && index < prevLists.length - 1)
      ) {
        const newLists = [...prevLists];
        const temp = newLists[index];
        newLists[index] = newLists[index + (direction === "up" ? -1 : 1)];
        newLists[index + (direction === "up" ? -1 : 1)] = temp;
        return newLists;
      }
      return prevLists;
    });
  }, []);

  const checkListCompletion = useCallback(
    (listId: number) => {
      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id === listId) {
            const allTasksCompleted =
              list.tasks.length > 0 &&
              list.tasks.every((task) => task.completed);
            if (allTasksCompleted && !completedLists.includes(listId)) {
              setCompletedLists((prev) => [...prev, listId]);
              setShowCelebration(true);
              setTimeout(() => setShowCelebration(false), 2000);
            }
            return { ...list, hidden: allTasksCompleted };
          }
          return list;
        })
      );
    },
    [completedLists]
  );

  const addTask = useCallback(
    (
      listId: number,
      taskTitle: string,
      taskDescription: string,
      taskDueDate: string | null
    ) => {
      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id === listId) {
            if (taskDueDate) {
              const listDueDate = list.dueDate ? new Date(list.dueDate) : null;
              const taskDueDateObj = new Date(taskDueDate);
              if (listDueDate && taskDueDateObj > listDueDate) {
                alert("Task due date cannot be later than the list due date.");
                return list;
              }
            }
            const newTask: Task = {
              id: Date.now(),
              title: taskTitle,
              description: taskDescription,
              completed: false,
              hidden: false,
              dueDate: taskDueDate,
            };
            return { ...list, tasks: [...list.tasks, newTask] };
          }
          return list;
        })
      );
    },
    []
  );

  const toggleTask = useCallback(
    (listId: number, taskId: number) => {
      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id === listId) {
            const updatedTasks = list.tasks.map((task) =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
            );
            return { ...list, tasks: updatedTasks };
          }
          return list;
        })
      );
      checkListCompletion(listId);
    },
    [checkListCompletion]
  );

  const deleteTask = useCallback((listId: number, taskId: number) => {
    setConfirmDelete({ isOpen: true, type: "task", id: taskId, listId });
  }, []);

  const toggleListVisibility = useCallback((listId: number) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId ? { ...list, hidden: !list.hidden } : list
      )
    );
  }, []);

  const toggleTaskVisibility = useCallback((listId: number, taskId: number) => {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            tasks: list.tasks.map((task) =>
              task.id === taskId ? { ...task, hidden: !task.hidden } : task
            ),
          };
        }
        return list;
      })
    );
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmDelete.type === "list") {
      setLists((prevLists) =>
        prevLists.filter((list) => list.id !== confirmDelete.id)
      );
    } else if (confirmDelete.type === "task") {
      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id === confirmDelete.listId) {
            return {
              ...list,
              tasks: list.tasks.filter((task) => task.id !== confirmDelete.id),
            };
          }
          return list;
        })
      );
    }
    setConfirmDelete({ isOpen: false, type: "", id: null, listId: null });
  }, [confirmDelete]);

  const applyFilters = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  }, []);

  const filteredLists = useMemo(() => {
    let result = lists.filter((list) => {
      if (!showHidden && list.hidden) return false;
      if (
        filters.priority.length > 0 &&
        !filters.priority.includes(list.priority)
      )
        return false;
      return true;
    });

    if (filters.dueDateOrder) {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return filters.dueDateOrder === "asc" ? dateA - dateB : dateB - dateA;
      });
    }

    return result;
  }, [lists, showHidden, filters]);

   if (user) return (
    <div className="flex flex-col min-h-screen bg-background w-full">
      {/* <Header /> */}
      <main className="flex-1 py-6 px-2 sm:px-4 md:px-6 w-full">
        {showCelebration && <Celebration />}
        <ConfirmDialog
          isOpen={confirmDelete.isOpen}
          onClose={() =>
            setConfirmDelete({
              isOpen: false,
              type: "",
              id: null,
              listId: null,
            })
          }
          onConfirm={handleConfirmDelete}
          title={`Delete ${confirmDelete.type === "list" ? "List" : "Task"}`}
          description={`Are you sure you want to delete this ${confirmDelete.type}? This action cannot be undone.`}
          action={`Confirm`}
          actionClassName={
            "bg-destructive-foreground hover:bg-destructive border-2 border-destructive hover:border-destructive-foreground text-destructive hover:text-destructive-foreground"
          }
        />
        <h1 className="text-4xl sm:text-7xl font-bold mb-6 text-secondary text-center">
          My To-Do Lists
        </h1>
        <div className="flex flex-wrap justify-between items-center mb-5">
          <AddListDialog onAddList={addList} />
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowFilterModal(true)}
              className={cn(
                "text-primary border-primary hover:bg-primary hover:text-primary-foreground",
                (filters.priority.length > 0 || filters.dueDateOrder) &&
                  "bg-secondary border-secondary hover:bg-secondary-hover text-white"
              )}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowHidden(!showHidden)}
              className={cn(
                "text-primary border-primary hover:bg-primary hover:text-primary-foreground",
                showHidden &&
                  "bg-secondary border-secondary hover:bg-secondary-hover text-white"
              )}
            >
              {showHidden ? (
                <Eye className="mr-2 h-4 w-4" />
              ) : (
                <EyeOff className="mr-2 h-4 w-4" />
              )}
              {showHidden ? "Hide Completed Lists" : "Show Completed Lists"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className={cn(
                "text-primary border-primary hover:bg-primary hover:text-primary-foreground",
                viewMode === "list" &&
                  "bg-secondary border-secondary hover:bg-secondary-hover text-white"
              )}
            >
              {viewMode === "grid" ? (
                <Menu className="mr-2 h-4 w-4" />
              ) : (
                <LayoutGrid className="mr-2 h-4 w-4" />
              )}
              {viewMode === "grid" ? "List View" : "Grid View"}
            </Button>
          </div>
        </div>
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : ""
          }`}
        >
          {filteredLists.map((list, index) => (
            <TodoList
              key={list.id}
              list={list}
              onDelete={deleteList}
              onUpdate={updateList}
              onMove={moveList}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onToggleListVisibility={toggleListVisibility}
              onToggleTaskVisibility={toggleTaskVisibility}
              isFirst={index === 0}
              isLast={index === filteredLists.length - 1}
              showHidden={showHidden}
            />
          ))}
        </div>
      </main>
      {/* <Footer /> */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        currentFilters={filters}
        onApplyFilters={(newFilters) => {
          setFilters(newFilters);
          setShowFilterModal(false);
        }}
      />
      <Toaster />
    </div>
  );
}
