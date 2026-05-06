import { ReactNode } from "react";

interface CardProps {
  title?: string;
  icon?: ReactNode;
  button?: ReactNode;
  className?:string;
  children: ReactNode;
}

const CommonCard: React.FC<CardProps> = ({ title, icon, button,className, children }) => {
  return (
    <div className="flex flex-col mt-1 rounded-md border border-border h-full mx-2 shadow-md ">
      {/* Header */}
      <div className={`flex ${className} bg-header justify-between items-center p-1 border-purple-600
       border-b-2 text-sm text-white font-semibold `}>
        <div className="flex items-center">
          {icon}
          <div className="ml-1">{title}</div>
        </div>
        {button}
      </div>

      {/* Body */}
      <div className="p-2 flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default CommonCard;
