import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col m-2">
      {label && (
        <label className="text-labelText text-xs font-semibold mb-1">
          {label}
        </label>
      )}
      <input
        {...props}
        placeholder={label&& 'Enter ' + label}
        className="px-2 py-1 h-6 border border-inputBorder text-xs 
         focus:outline-none
         focus:bg-gray-100 text-inputText
          placeholder-placeholder bg-inputBg disabled:bg-disabled"
      />
    </div>
  );
};

export default Input;
