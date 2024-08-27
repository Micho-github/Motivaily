import React from "react";
import { CiWavePulse1 } from "react-icons/ci";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaBoltLightning } from "react-icons/fa6";
import styles from '@/components/animations/animation.module.css';
export default function RegisterPoster() {
  const Words_array = [
    { C: "M", L: "otivation" },
    { C: "O", L: "rganization" },
    { C: "T", L: "racking" },
    { C: "I", L: "nspiration" },
    { C: "V", L: "ictory" },
    { C: "A", L: "chievement" },
    { C: "I", L: "nitiative" },
    { C: "L", L: "eadership" },
    { C: "Y", L: "ield" },
  ];
  return (
    <div
      className={`relative hidden opacity-0 lg:flex flex-col items-center align-items-center justify-center transition-all duration-500 animate-fadeInUp h-screen overflow-hidden`}
      style={{
        animation: `${styles.fadeInUp} 1s ease-in-out forwards`,
      }}
    >

      <ul className="absolute top-10 left-50 inline-flex flex-wrap justify-center text-xl gap-4">
        {Words_array.map((card: any, index: any) => (
          <Card
            key={index}
            className="opacity-0  drop-shadow-xl px-5 py-3 animate-fadeInUp"
            style={{
              animation: `${styles.fadeInUp} 2s ease-in-out forwards`,
              animationDelay: `${ 2 + index * 0.5}s`,
            }}
          >
            <CardTitle>
              <span className="text-secondary font-bold text-3xl">
                {card.C}
              </span>
              <span>{card.L}</span>
            </CardTitle>
          </Card>
        ))}
      </ul>
      <h1 className="text-8xl text-secondary drop-shadow-xl">MOTIVAILY</h1>
      <CiWavePulse1 className="text-5xl text-secondary drop-shadow-xl" />
      <div className="drop-shadow-xl ">
        Boost your productivity, track your goals, and stay on top of your game
        with Motivaily!
      </div>
      <div></div>

      <div className=" absolute bottom-0 text-center text-black mb-8">
        <Card className="  left-0 bottom-0 text-sm space-y-2 drop-shadow-xl">
          <CardHeader>
            <CardTitle>
              Start your journey today with Motivaily and make every day count!
            </CardTitle>
          </CardHeader>
          <CardContent>
            🚀 Boost your productivity with smart task management.
          </CardContent>
          <CardContent>
            📅 Stay motivated with daily reminders and progress tracking.
          </CardContent>
          <CardContent>
            💪 Join a community of goal-driven individuals.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
