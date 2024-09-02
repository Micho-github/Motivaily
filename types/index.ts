import { UUID } from "crypto";

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

export interface users {
  uid: UUID;
  username: string;
  email: string;
  provider: "email" | "google" | "github";
  isactive: boolean;
  avatar_url: any;
  created_at: Date;
}
