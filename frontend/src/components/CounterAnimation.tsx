"use client";

import { useEffect, useRef, useState } from "react";

interface CounterAnimationProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function CounterAnimation({ 
  end, 
  duration = 2000, 
  suffix = "", 
  className = "",
  decimals = 0
}: CounterAnimationProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        const easeOutExpo = 1 - Math.pow(2, -10 * progress);
        setCount(easeOutExpo * end);
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.floor(num).toLocaleString('pt-BR');
  };

  return (
    <p ref={counterRef} className={className}>
      {formatNumber(count)}{suffix}
    </p>
  );
}
