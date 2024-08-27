'use client'
import { useState, useEffect, useRef } from "react";

export default function LandingHeader({ children }: any) {
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollTopRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const screenHeight = window.innerHeight;

      if (scrollTop > lastScrollTopRef.current) {
        if (scrollTop > screenHeight) {
          setHeaderHidden(true);
        }
      } else {
        setHeaderHidden(false);
      }

      lastScrollTopRef.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`${
        headerHidden ? "-translate-y-full" : "translate-y-0"
      } sticky bg-background top-0 px-4 z-[99] lg:px-6 h-14 flex items-center border-b transition-transform duration-300 ease-in-out`}
    >
      {children}
    </header>
  );
}
