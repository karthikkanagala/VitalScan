import React, { useState, useEffect } from 'react';

export default function RiskGauge({ score, label, color = 'green' }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [score]);

  const getColorClass = () => {
    if (score <= 30) return 'from-green-500 to-green-400';
    if (score <= 60) return 'from-yellow-500 to-yellow-400';
    return 'from-red-500 to-red-400';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        {/* Outer glow */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${getColorClass()} opacity-20 blur-xl animate-pulse`}
        ></div>

        {/* SVG Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(0, 255, 136, 0.1)"
            strokeWidth="2"
          />

          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={
              score <= 30
                ? 'rgb(34, 197, 94)'
                : score <= 60
                ? 'rgb(234, 179, 8)'
                : 'rgb(239, 68, 68)'
            }
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.05s linear',
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-white animate-count-up">
            {displayScore}%
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="mt-6 text-center">
        <h3 className="text-lg font-bold text-white mb-2">{label}</h3>
        <p className="text-sm text-gray-400">
          {score <= 30
            ? 'Low Risk'
            : score <= 60
            ? 'Moderate Risk'
            : 'High Risk'}
        </p>
      </div>
    </div>
  );
}
