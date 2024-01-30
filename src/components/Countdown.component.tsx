"use client";

import { useState, useEffect } from "react";

const formatTime = (timeInSeconds: number): string => {
  const days = Math.floor(timeInSeconds / (60 * 60 * 24));
  const hours = Math.floor((timeInSeconds / (60 * 60)) % 24);
  const minutes = Math.floor((timeInSeconds / 60) % 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${days}:${hours}:${minutes}:${seconds}`;
};

const Countdown = () => {
  let difference = (+new Date(`2/10/2024`) - +new Date()) / 1000;

  const [countdown, setCountdown] = useState<number>(difference);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    difference<0 &&       clearInterval(timer);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <span className="font-bold text-5xl text-yellow-300">
      { formatTime(countdown)}
    </span>
  );
};

export default Countdown;
