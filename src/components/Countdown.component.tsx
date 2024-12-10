"use client";

import { useState, useEffect } from "react";

const countdownTemplate = (timeInSeconds: number): string => {
  const days = Math.floor(timeInSeconds / (60 * 60 * 24));
  const hours = Math.floor((timeInSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((timeInSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(timeInSeconds % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const Countdown = ({ startDate }: { startDate: string }) => {
  const targetDate = new Date(startDate).getTime();
  const [countdown, setCountdown] = useState<number>(

  );


  useEffect(() => {
    const initialCountdown = Math.max((targetDate - Date.now()) / 1000, 0);
    setCountdown(initialCountdown);

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown != undefined && prevCountdown > 0) {
          return prevCountdown - 1;
        }
        clearInterval(timer);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <span className="font-bold text-5xl text-yellow-300">
      {countdownTemplate(countdown!)}
    </span>
  );
};

export default Countdown;
