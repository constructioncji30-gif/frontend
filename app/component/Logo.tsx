'use client';
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center ">
      {/* Circle with Check */}
      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Text */}
      <div className="flex items-center text-xl font-bold">
        <span className="text-black">CJI</span>
        {/* <span className="text-purple-600 ml-1">Timely</span> */}
      </div>
    </div>
  );
};

export default Logo;
