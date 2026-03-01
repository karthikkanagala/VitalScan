import React from 'react';

export default function ActionPlanCard({ rank, title, description, icon }) {
  const getRankColor = () => {
    switch (rank) {
      case 1:
        return 'bg-red-500/20 border-red-400/50';
      case 2:
        return 'bg-yellow-500/20 border-yellow-400/50';
      case 3:
        return 'bg-green-500/20 border-green-400/50';
      default:
        return 'bg-gray-500/20 border-gray-400/50';
    }
  };

  return (
    <div
      className={`card-glow border-2 ${getRankColor()} transition-all duration-300 hover:shadow-lg transform hover:scale-105`}
    >
      <div className="flex items-start gap-4">
        {/* Rank Badge */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
          rank === 1
            ? 'bg-red-500'
            : rank === 2
            ? 'bg-yellow-500'
            : 'bg-green-500'
        }`}>
          {rank}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{icon}</span>
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      </div>

      {/* Action arrow */}
      <div className="mt-4 flex justify-end">
        <button className="text-green-400 hover:text-green-300 transition-colors duration-300 text-sm font-semibold flex items-center gap-2">
          Learn More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
