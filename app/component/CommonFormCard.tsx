"use client";
import React, { ReactNode } from "react";

interface CommonFormCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  cols?: number; // 👈 optional prop for default columns
}

const CommonFormCard: React.FC<CommonFormCardProps> = ({
  children,
  className = "",
  title,
  cols = 3,
}) => {
  return (
    <>
      {title && (
        <div className="text-sm font-semibold text-modalHeader mb-2">
          {title}
        </div>
      )}
      <div
        className={`grid p-2 sm:grid-cols-1  mb-4 gap-x-4 border border-border shadow-md md:grid-cols-${cols} ${className}`}
      >
        {children}
      </div>
    </>
  );
};

export default CommonFormCard;
