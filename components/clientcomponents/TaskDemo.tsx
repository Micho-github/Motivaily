"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { BotIcon } from "lucide-react";
import Chance from "chance";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import "@/components/customstyles/styles.module.css";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
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

export default function TaskDemo() {
  const [Type, setType] = useState<"simple" | "professional">("simple");
  const [tasks, setTasks] = useState([]);
  const [date, setDate] = useState<Date>();

  const toggleType = () => {
    setType((prev) => (prev === "simple" ? "professional" : "simple"));
  };

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

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="relative flex space-y-4 flex-col items-center justify-center mb-20 ">
      <Card className="w-full  max-w-md overflow-hidden">
        <CardContent className="pb-0 pr-6 pl-6 pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center space-x-4 mb-8"
          >
            <Button
              variant={Type === "simple" ? "default" : "outline"}
              onClick={() => setType("simple")}
              className={
                Type === "simple"
                  ? "bg-foreground hover:bg-primary text-background"
                  : ""
              }
            >
              Simple
            </Button>
            <Button
              variant={Type === "professional" ? "default" : "outline"}
              onClick={() => setType("professional")}
              className={
                Type === "professional"
                  ? "bg-foreground hover:bg-primary text-background"
                  : ""
              }
            >
              Professional
            </Button>
          </motion.div>

          <motion.div
            key={Type}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={` p-6 rounded-lg ${
              Type === "simple"
                ? "bg-background text-foreground"
                : "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Todo List</h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className={`rounded-xl text-inherit bg-inherit radius-lg border-2 border-transparent ${Type === "simple" ? 'hover:border-foreground':'hover:border-white'} transition-colors`}>
                    <FaPlus className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Add New Todo</h4>
                      <p className="text-sm text-muted-foreground">
                        Fill out the form below to add a new task to your to-do
                        list.
                      </p>
                    </div>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="title">Title</Label>
                        <Textarea
                          id="title"
                          className="col-span-2 w-full resize-none"
                          placeholder="Enter the task title here"
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="date">Due Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`
            w-[230px] justify-start text-left font-normal
            ${!date && "text-muted-foreground"}
          `}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="risk-level">Priority Level</Label>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">Hard</SelectItem>
                              <SelectItem value="crictical">
                                Crictical
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <Label className="text-sm text-muted-foreground">
                        Complete the form and click "Submit" to add the task to
                        your list.
                      </Label>
                      <Button className="bg-secondary text-white hover:bg-secondary-hover rounded-full mt-3">
                        Submit
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Separator className={` ${Type === "simple" ? ' bg-foreground ' : ' bg-white'} `}/>
            <div className="space-y-4 w-full min-h-[300px] pb-10">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex  items-center justify-between rounded-md p-4 shadow-sm transition-colors border-2 border-transparent  hover:border-black"
                  >
                    <div className="flex items-center gap-4 ">
                      <Checkbox
                        id={`task-${task.id}`}
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="text-black"
                      />
                      <Label
                        htmlFor={`task-${task.id}`}
                        className={`cursor-pointer text-lg font-medium ${
                          task.completed ? "line-through text-secondary" : ""
                        }`}
                      >
                        {task.title}
                      </Label>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm" // or size="xs"
                      onClick={() => removeTask(task.id)}
                      className="text-black border-2 border-transparent hover:border-black transition-colors"
                    >
                      <Trash2 className=" w-4 h-4" />{" "}
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
          </motion.div>
          <p
            className={`${
              Type === "simple" ? "text-center" : "text-left"
            } mt-6 text-primary w-full text-sm text-center`}
          >
            {Type === "simple"
              ? "This is a simple and friendly interface."
              : "Welcome to your professional workspace. Manage your tasks efficiently."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
