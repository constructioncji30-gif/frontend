import React from "react";

interface CommonRadioButtonProps {
  label: string;
  name?: string;
  value?: string;
  checked: boolean;
  onClick: (value?: string) => void;
  className?: string;
}

const CommonRadioButton: React.FC<CommonRadioButtonProps> = ({
  label,
  name,
  value,
  checked,
  onClick,
  className = "",
}) => {
  const id = `${name || "radio"}-${value || label}`; // unique ID

  return (
    <div
      className={`flex items-center ${className} cursor-pointer`}
      onClick={() => onClick(value)}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onClick(value)} // proper controlled input
        className="hidden"
      />
      <label htmlFor={id} className="flex items-center cursor-pointer select-none">
        <div
          className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center transition-colors ${
            checked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"
          }`}
        >
          {checked && <div className="w-2 h-2 rounded-full bg-white"></div>}
        </div>
        {label}
      </label>
    </div>
  );
};

export default CommonRadioButton;
