// src/components/LockBodyGutter.tsx
"use client";
import { useEffect } from "react";

export default function LockBodyGutter() {
  useEffect(() => {
    const target = document.body;

    const fixGutter = () => {
      // push to the end of the event queue so Radix finishes first
      requestAnimationFrame(() => {
        if (target.style.overflow === "hidden") {
          target.style.scrollbarGutter = "stable";
        }
      });
    };

    // initial call
    fixGutter();

    // watch future changes
    const obs = new MutationObserver(fixGutter);
    obs.observe(target, { attributeFilter: ["style"] });

    return () => obs.disconnect();
  }, []);

  return null;
}
