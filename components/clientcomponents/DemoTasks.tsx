"use client";
import React, { useEffect, useRef, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardHeader, CardTitle } from "../ui/card";

const todos = [
  { id: 1, text: "Complete project proposal", status: "completed" },
  { id: 2, text: "Review client feedback", status: "pending" },
  { id: 3, text: "Update website content", status: "pending" },
  { id: 4, text: "Prepare for team meeting", status: "urgent" },
  { id: 5, text: "Send invoice to client", status: "completed" },
];

const getIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case "urgent":
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Circle className="w-5 h-5 text-gray-400" />;
  }
};

const MouseCursor = ({ controls }: any) => (
  <motion.div
    className="absolute right-10 top-10 z-10 pointer-events-none"
    animate={controls}
    transition={{ type: "spring", stiffness: 100, damping: 20 }}
  >
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ scale: [1, 0.9, 1] }}
      transition={{ duration: 0.2 }}
    >
      <path
        d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
        fill="black"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  </motion.div>
);

export default function DemoTasks({ isDemoVisible }: any) {
  const [clickedTodo, setClickedTodo] = useState<number | null>(null);
  const mouseControls = useAnimation();
  const isMounted = useRef(true);

  useEffect(() => {
    let isCancelled = false;

    if (!isDemoVisible) {
      mouseControls.stop();
      return; // Exit early if not visible
    }

    const animateMouse = async () => {
      // Exit if cancelled
      if (isCancelled) return;

      await mouseControls.start({ x: "20%", y: "30%" });

      for (let i = 0; i < todos.length; i++) {
        if (isCancelled) return; // Stop if cancelled

        // Move to the start of the todo item
        await mouseControls.start({ x: `${i - 20}px`, y: `${i * 65 + 120}px` });

        // Simulate click
        mouseControls.start({ scale: 0.9 });
        setClickedTodo(todos[i].id);
        await new Promise((resolve) => setTimeout(resolve, 200));
        mouseControls.start({ scale: 1 });

        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      // Move cursor out to the right
      await mouseControls.start({ x: "500%", y: "500%" });
      setClickedTodo(null);

      // Pause before restarting the animation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (!isCancelled) animateMouse(); // Recursively call if not cancelled
    };

    animateMouse();

    // Cleanup function to set the cancellation flag
    return () => {
      isCancelled = true;
      mouseControls.stop(); // Ensure to stop controls on cleanup
    };
  }, [mouseControls, isDemoVisible, todos]); // Add `todos` dependency if it changes

  return (
    <Card
      className={` max-w-md bg-card mx-auto mt-8 p-6 rounded-lg shadow-lg border relative `}
    >
      <MouseCursor controls={mouseControls} />
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-6">
          My First Todo List
        </CardTitle>
      </CardHeader>
      <div className="space-y-4">
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            className={`flex items-center p-3 rounded-lg ${
              todo.status === "completed"
                ? "bg-green-50"
                : todo.status === "urgent"
                ? "bg-red-50"
                : "bg-gray-50"
            }`}
            animate={
              clickedTodo === todo.id
                ? {
                    scale: 1.03,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }
                : { scale: 1 }
            }
          >
            {getIcon(todo.status)}
            <span
              className={`ml-3 ${
                todo.status === "completed"
                  ? "text-secondary line-through"
                  : todo.status === "urgent"
                  ? "text-red-500 font-medium"
                  : "text-black"
              }`}
            >
              {todo.text}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span>5 tasks</span>
          <span>2 completed</span>
        </div>
      </div>
    </Card>
  );
}
