import React, { ReactNode } from "react";

interface ModalProps {
  close: (open: boolean) => void;
  title: string;
  icon?:ReactNode
  children: ReactNode;
  size?: "sm" | "md" | "lg"; // Optional: control modal width
}

const Modal: React.FC<ModalProps> = ({
  icon,
  close,
  title,
  children,
  size = "md",
}) => {
  // Map size to Tailwind width classes
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={() => close(false)}
      />

      {/* Modal Content */}
      <div
        className={`relative bg-modalBody rounded-t-xl  ${sizeClasses[size]}  z-10`}
      >
        {/* Header */}
        <div
          className="bg-header text-modalHeaderText px-2 py-[0.8px] 
         rounded-t-xl flex justify-between items-center"
        >
          <h3 className=" font-semibold text-sm"><i className="me-1">{icon}</i>{title}</h3>
          <button
            onClick={() => close(false)}
            className="text-modalCloseHover h-5 w-5 flex justify-center bg-slate-300
            rounded-full items-center hover:text-modalCloseHover font-bold "
          >
            x
          </button>
        </div>

        {/* Body */}
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
