"use client";

import React, { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
}

export default function AnimatedCounter({ value, duration = 2.5, suffix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const controls = animate(0, value, {
        duration,
        ease: "easeOut",
        onUpdate(val) {
          setCount(Math.floor(val));
        },
      });
      return () => controls.stop();
    }
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="font-heading tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
