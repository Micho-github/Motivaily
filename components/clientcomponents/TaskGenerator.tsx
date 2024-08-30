"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { BotIcon } from "lucide-react";
import Chance from "chance";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import '@/components/customstyles/styles.module.css'
const chance = new Chance();

const randomTasks = [
  // Rude
  "Stop procrastinating, you lazy bum.",
  "Tell your annoying coworker to mind their own business.",
  "Stop being a people-pleaser for one day.",
  "Unfriend that toxic person you keep complaining about.",
  "Finally get around to that task you've been avoiding for weeks.",

  // Funny
  "Write a letter to your future self and include today’s most random thought.",
  "Plan a spontaneous road trip to the weirdest place you can find on the map.",
  "Create a funny meme that represents your day and share it with a friend.",
  "Have a full conversation with your pet about life decisions.",
  "Try to make someone laugh by only using bad puns.",

  // Work
  "Finish that report you’ve been avoiding all week.",
  "Organize your inbox and delete those old unread emails.",
  "Set up a meeting with your team to brainstorm new ideas.",
  "Update your LinkedIn profile with your latest achievements.",
  "Plan your work tasks for the next week and set realistic goals.",

  // Life Stuff
  "Go for a 30-minute walk without any distractions.",
  "Cook a new recipe for dinner tonight.",
  "Clean out your closet and donate clothes you no longer wear.",
  "Call or text a friend or family member you haven’t spoken to in a while.",
  "Spend an hour reading a book or article on a topic you’re curious about.",
];
// Define task type
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function TaskGenerator() {
  const [Type, setType] = useState<"simple" | "professional">("simple");
  const [tasks, setTasks] = useState<Task[]>([]); // Typing tasks as an array of Task
  const [date, setDate] = useState<Date | undefined>(); // Date can be undefined initially

  const generateTask = () => {
    const randomTask = {
      id: Date.now(),
      title: chance.pickone(randomTasks),
      completed: false,
    };
    const updatedTasks = [randomTask, ...tasks];
    if (updatedTasks.length > 3) {
      updatedTasks.pop();
    }

    setTasks(updatedTasks);
  };

  const toggleTask = (id:number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id:number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="text-foreground  flex space-y-4 flex-col items-center justify-center mb-20 ">
      <Button
        onClick={generateTask}
        className="mx-auto btn  rounded-2xl flex items-center justify-center text-md gap-2 bg-secondary hover:bg-secondary-hover text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div>
          <svg
            height="24"
            width="24"
            fill="#FFFFFF"
            viewBox="0 0 24 24"
            data-name="Layer 1"
            id="Layer_1"
            className="sparkle"
          >
            <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
          </svg>
        </div>
        <div>Generate Task</div>
      </Button>
      
      <div className="w-full  shadow-lg max-w-md mx-auto">
      <div className="bg-black w-full">sada</div>
      <div className="min-h-[300px] bg-card p-6 rounded-b-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Todo List</h2>
          <Button
            onClick={generateTask}
            className="text-foreground bg-background border-2 border-foreground transition-colors"
          >
            <FaPlus className="w-5 h-5" />
          </Button>
        </div>
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-background border border-input rounded-md p-4 shadow-sm transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="text-primary"
                  />
                  <Label
                    htmlFor={`task-${task.id}`}
                    className={`text-lg font-medium ${
                      task.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.title}
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="sm" // or size="xs"
                  onClick={() => removeTask(task.id)}
                  className=" text-muted-foreground hover:border-2 border-foreground hover:bg-muted/50 transition-colors"
                >
                  <Trash2 className="text-foreground w-4 h-4" />{" "}
                  {/* adjust icon size to match button size */}
                  <span className="sr-only">Remove Task</span>
                </Button>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-[300px] text-center">
              No tasks here, just a blank canvas for your next big idea!
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
