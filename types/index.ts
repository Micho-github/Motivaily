export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  hidden: boolean;
  dueDate: string | null;
}

export interface TodoList {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  dueDate: string | null;
  hidden: boolean;
  tasks: Task[];
}
