"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, EyeOff, Eye, Filter, LayoutGrid } from "lucide-react";
import Header from "@/components/mainPageComponents/Header";
import Footer from "@/components/mainPageComponents/Footer";
import TodoList from "@/components/mainPageComponents/TodoList";
import FilterModal from "@/components/mainPageComponents/FilterModal";
import { lists, tasks } from "@/types";
import Celebration from "@/components/mainPageComponents/Celebration";
import AddListDialog from "@/components/mainPageComponents/AddListDialog";
import ConfirmDialog from "@/components/mainPageComponents/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { number } from "yup";

export default function Index() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [lists, setLists] = useState<lists[]>([]);
  const [tasks, setTasks] = useState<tasks[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error(userError);
        return router.push("/");
      }
      setUser(user);

      // Fetch lists
      const { data: listsData, error: listsError } = await supabase
        .from("lists")
        .select("*")
        .eq("userid", user.id) //
        .order("created_at", { ascending: false });

      // Fetch tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from("tasks")
        .select("*");

      if (listsError || tasksError) {
        console.error(listsError || tasksError);
        return;
      }

      setLists(listsData || []);
      setTasks(tasksData || []);
    };

    fetchData();
  }, [router, supabase]);

  const [completedLists, setCompletedLists] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: string;
    id: string | null;
    listId: string | null;
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
    async (newList: Omit<lists, "id" | "tasks">) => {
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

      // Insert new list into Supabase
      const { data: listData, error: listError } = await supabase
        .from("lists")
        .insert([
          {
            ...newList,
            userid: user.id, // Use the current user's ID
            created_at: new Date().toISOString(),
          },
        ])
        .single();

      if (listError) {
        console.error(listError);
        return;
      }

      // Assert the type of listData to match the lists interface
      const typedListData: lists = listData as lists;

      setLists((prevLists) => [
        ...prevLists,
        { ...typedListData, tasks: [] }, // Ensure tasks are initialized as empty
      ]);
    },
    [supabase, user, toast]
  );

  const deleteList = useCallback((id: string) => {
    setConfirmDelete({ isOpen: true, type: "list", id, listId: null });
  }, []);

  const updateList = useCallback(
    async (updatedList: lists) => {
      // Update list in Supabase
      const { error: updateError } = await supabase
        .from("lists")
        .update(updatedList)
        .eq("id", updatedList.id);

      if (updateError) {
        console.error(updateError);
        return;
      }
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === updatedList.id ? updatedList : list
        )
      );
    },
    [supabase]
  );

  const moveList = useCallback(
    async (id: string, direction: "up" | "down") => {
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

          // Update positions in Supabase
          newLists.forEach((list, newIndex) =>
            supabase
              .from("lists")
              .update({ position: newIndex })
              .eq("id", list.id)
          );

          return newLists;
        }
        return prevLists;
      });
    },
    [supabase]
  );

  const checkListCompletion = useCallback(
    async (listId: string) => {
      // Fetch the list and its tasks from Supabase
      const { data: listData, error: listError } = await supabase
        .from("lists")
        .select("*, tasks(*)")
        .eq("id", listId)
        .single();

      if (listError) {
        console.error(listError);
        return;
      }

      // Ensure listData is defined and has tasks
      if (!listData || !listData.tasks) return;

      // Determine if all tasks are completed
      const allTasksCompleted = (listData.tasks as tasks[]).every(
        (task: tasks) => task.completed
      );

      // Update the list's hidden status based on task completion
      const { error: updateError } = await supabase
        .from("lists")
        .update({ hidden: allTasksCompleted })
        .eq("id", listId);

      if (updateError) {
        console.error(updateError);
      }
    },
    [supabase]
  );

  const addTask = useCallback(
    async (
      listId: string,
      taskTitle: string,
      taskDescription: string | null,
      taskDueDate: string | null
    ) => {
      const list = lists.find((list) => list.id === listId);
      const taskCount = list?.tasks?.length ?? 0;

      // Create a new task object
      const newTask: Omit<tasks, "id"> = {
        title: taskTitle,
        description: taskDescription,
        completed: false,
        hidden: false,
        dueDate: taskDueDate,
        listID: listId,
        position: taskCount + 1,
      };

      // Insert the new task into the database
      const { data, error } = await supabase
        .from("tasks")
        .insert([newTask])
        .select()
        .single();

      if (error) {
        console.error("Error inserting task:", error);
        return;
      }

      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId
            ? {
                ...list,
                tasks: (list.tasks || []).map((task) =>
                  task.title === newTask.title &&
                  task.description === newTask.description
                    ? { ...task }
                    : task
                ),
              }
            : list
        )
      );
    },
    [supabase, lists]
  );

  const toggleTask = useCallback(
    (listId: string, taskId: string) => {
      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id === listId) {
            const updatedTasks = list.tasks.map((task) =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
            );

            // Update task completion status in Supabase
            supabase
              .from("tasks")
              .update({
                completed: !updatedTasks.find((task) => task.id === taskId)
                  ?.completed,
              })
              .eq("id", taskId)
              .eq("listID", listId);

            return { ...list, tasks: updatedTasks };
          }
          return list;
        })
      );
      checkListCompletion(listId);
    },
    [checkListCompletion, supabase]
  );

  const deleteTask = useCallback((listId: string, taskId: string) => {
    setConfirmDelete({ isOpen: true, type: "task", id: taskId, listId });
  }, []);

  const toggleListVisibility = useCallback(
    async (listId: string) => {
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId ? { ...list, hidden: !list.hidden } : list
        )
      );

      // Update list visibility in Supabase
      await supabase
        .from("lists")
        .update({ hidden: !lists.find((list) => list.id === listId)?.hidden })
        .eq("id", listId);
    },
    [lists, supabase]
  );

  const toggleTaskVisibility = useCallback(
    (listId: string, taskId: string) => {
      setLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id === listId) {
            const updatedTasks = list.tasks.map((task) =>
              task.id === taskId ? { ...task, hidden: !task.hidden } : task
            );

            // Update task visibility in Supabase
            supabase
              .from("tasks")
              .update({
                hidden: !updatedTasks.find((task) => task.id === taskId)
                  ?.hidden,
              })
              .eq("id", taskId);

            return { ...list, tasks: updatedTasks };
          }
          return list;
        })
      );
    },
    [supabase]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (confirmDelete.type === "list") {
      // Delete list from Supabase
      await supabase.from("lists").delete().eq("id", confirmDelete.id);
      setLists((prevLists) =>
        prevLists.filter((list) => list.id !== confirmDelete.id)
      );
    } else if (confirmDelete.type === "task") {
      // Delete task from Supabase
      await supabase.from("tasks").delete().eq("id", confirmDelete.id);
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
  }, [confirmDelete, supabase]);

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

  if (user)
    return (
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
            title={`Delete ${confirmDelete.type === "list" ? "List" : "tasks"}`}
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
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
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
