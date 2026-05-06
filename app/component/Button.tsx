import React, { ButtonHTMLAttributes } from "react";

type ButtonType = "primary" | "secondary" | "success" | "danger" | "warning" | "view";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  varient?: ButtonType;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ varient = "primary", className = "", children, ...props }) => {
  const styles: Record<ButtonType, string> = {
    primary: "bg-primary hover:bg-primaryHover text-white",
    secondary: "bg-secondary hover:bg-secondaryHover text-secondaryText",
    success: "bg-success hover:bg-successHover text-white",
    danger: "bg-danger hover:bg-dangerHover text-white",
    warning: "bg-warning hover:bg-warningHover text-white",
    view: "bg-view hover:bg-viewHover text-white",
  };

  return (
    <button
      {...props}
      className={`px-4 py-1 rounded-full mx-1 font-semibold text-xs shadow-sm ${styles[varient]} ${className}`}
    >
      {children}
    </button>

    
  );
};

export default Button;
