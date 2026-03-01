import React from 'react';

export default function StepProgress({ currentStep, totalSteps, steps }) {
  return (
    <div className="w-full mb-8">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            {/* Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                index < currentStep
                  ? 'bg-green-400 text-black'
                  : index === currentStep
                  ? 'bg-green-400/50 text-white border-2 border-green-400'
                  : 'bg-gray-700 text-gray-400 border-2 border-gray-600'
              }`}
            >
              {index < currentStep ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>

            {/* Label */}
            <p className={`text-xs mt-2 text-center font-semibold transition-all duration-300 ${
              index <= currentStep ? 'text-green-400' : 'text-gray-500'
            }`}>
              {step}
            </p>

            {/* Connector line */}
            {index < totalSteps - 1 && (
              <div
                className={`h-1 flex-1 mx-2 mt-4 transition-all duration-300 ${
                  index < currentStep ? 'bg-green-400' : 'bg-gray-700'
                }`}
                style={{
                  height: '2px',
                  width: '100%',
                  position: 'absolute',
                  left: `calc(50% + 20px)`,
                  top: '20px',
                  zIndex: -1,
                }}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mt-10">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
          style={{
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
