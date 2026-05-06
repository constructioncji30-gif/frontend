import React, {  TextareaHTMLAttributes } from "react";

 
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; // Custom prop
}
const TextAea: React.FC<TextareaProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col m-2">
      {label && (
        <label className="text-labelText text-xs font-semibold mb-1">
          {label}
        </label>
      )}
      
        <textarea
          {...props}
          cols={4}
          rows={3}
          placeholder={"Enter " + label}
          className="px-2 py-1  border border-inputBorder text-xs 
         focus:outline-none
         focus:bg-gray-100 text-inputText
          placeholder-placeholder bg-inputBg disabled:bg-disabled"
        />
      
    </div>
  );
};

export default TextAea;
