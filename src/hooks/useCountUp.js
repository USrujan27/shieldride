import { useState, useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, animate } from 'framer-motion';

export function useCountUp(endValue, duration = 2) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, endValue, {
      duration: duration,
      ease: "easeOut",
      onUpdate: (value) => {
        setDisplayValue(Math.round(value));
      }
    });

    return controls.stop;
  }, [endValue, duration]);

  return displayValue;
}
