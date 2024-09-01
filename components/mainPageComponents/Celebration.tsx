import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import Image from "next/image";

export default function Celebration() {
  const [show, setShow] = useState(true);
  const [celebrationEmoji, setCelebrationEmoji] = useState("🎉");

  useEffect(() => {
    const emojis = [
      "🎉",
      "🎊",
      "🥳",
      "🎈",
      "✨",
      "🎇",
      "💃🕺",
      "🫡",
      "🐦‍🔥",
      "👍",
      "👏",
      "🎆",
      "🧨",
      "👑",
      "🎯",
      "🏅",
      "🎖️",
      "🏆",
      "🍾",
      "🍻",
      "🥂",
      "⭐",
      "🌟",
      "🔥",
      "⚡",
      "❤️‍🔥",
      "💖",
      "💫",
      "💯",
    ];
    setCelebrationEmoji(emojis[Math.floor(Math.random() * emojis.length)]);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <span className="text-9xl animate-bounce flex flex-row">
        {celebrationEmoji}
        {/* <Image
          src="/images/motivaily-favicon-color.png"
          width={100}
          height={100}
          alt="Bravo"
        /> */}
      </span>
    </div>
  );
}
