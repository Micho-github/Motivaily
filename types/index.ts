import { UUID } from "crypto";

export interface tasks {
  listID: string;
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  hidden: boolean;
  dueDate: string | null;
  position: number;
}

export interface lists {
  id: string;
  userid: string;
  title: string;
  description: string | null;
  priority: "Low" | "Medium" | "High" | "Critical";
  dueDate: string | null;
  hidden: boolean;
  position: number;
  tasks: tasks[];
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
