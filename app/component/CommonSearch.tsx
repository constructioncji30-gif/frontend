import React from "react";

const CommonSearch: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  ...props
}) => {
  return (
    <input
      {...props}
      className="px-2 py-1 rounded-xl border border-inputBorder text-xs
                 focus:outline-none focus:bg-gray-100 text-inputText
                 placeholder-placeholder bg-inputBg disabled:bg-disabled"
    />
  );
};

export default CommonSearch;
