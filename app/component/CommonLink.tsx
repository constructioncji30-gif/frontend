import Link, { LinkProps } from "next/link";
import React from "react";

type ButtonType =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "view";

interface ButtonProps extends LinkProps<HTMLButtonElement> {
  varient?: ButtonType;
  className?: string;
  title: string;
}

const CommonLink: React.FC<ButtonProps> = ({
  varient = "primary",
  className = "",
  title,
  ...props
}) => {
  const styles: Record<ButtonType, string> = {
    primary: "bg-primary hover:bg-primaryHover text-white",
    secondary: "bg-secondary hover:bg-secondaryHover text-secondaryText",
    success: "bg-success hover:bg-successHover text-white",
    danger: "bg-danger hover:bg-dangerHover text-white",
    warning: "bg-warning hover:bg-warningHover text-white",
    view: "bg-view hover:bg-viewHover text-white",
  };

  return (
    <Link
      {...props}
      className={`px-4 py-1 rounded-full font-semibold text-xs shadow-sm ${styles[varient]} ${className}`}
    >
      {title} 
    </Link>
  );
};

export default CommonLink;
