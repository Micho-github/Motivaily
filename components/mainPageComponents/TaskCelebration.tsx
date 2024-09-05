import React, { useEffect, useState } from "react";

const encouragingMessages = [
  "Great job!",
  "Keep it up!",
  "You're on fire! 🔥",
  "Awesome work!",
  "Making progress! 💪",
  "You're crushing it!",
  "Way to go!",
  "Fantastic! ⭐",
  "You're a star!",
  "Keep the momentum going!",
  "You're unstoppable!",
  "Brilliant work! 🌟",
];

const encouragingEmojis = [
  "👏",
  "🙌",
  "🌈",
  "🚀",
  "💪",
  "😎",
  "🤩",
  "👍",
  "💥",
];

interface TaskCelebrationProps {
  listId: string;
}

export default function TaskCelebration({ listId }: TaskCelebrationProps) {
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomMessage = () => {
      const useEmoji = Math.random() > 0.5;
      if (useEmoji) {
        return encouragingEmojis[
          Math.floor(Math.random() * encouragingEmojis.length)
        ];
      } else {
        return encouragingMessages[
          Math.floor(Math.random() * encouragingMessages.length)
        ];
      }
    };

    setMessage(randomMessage());

    const timer = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-lg font-bold animate-bounce shadow-lg">
        {message}
      </div>
    </div>
  );
}
