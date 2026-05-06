import React from "react";

interface CheckBoxProps {
  label?: string;
  values?: string[];
  checked: any; // single selected value
  onClick: (value: string) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({ values, checked, label, onClick }) => {
  return (
    <div className="flex flex-col m-2">
      {label && (
        <label className="text-labelText text-xs font-semibold mb-1">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {values&&values?.map((value) => (
          <label
            key={value}
            className="flex items-center rounded-sm text-labelText text-xs font-semibold px-2 py-1 cursor-pointer"
          >
            <input
              type="radio"
              name={label} // same name for single-select group
              value={value}
              checked={checked === value}
              onChange={() => onClick(value)}
              className="mr-2"
            />
            {value}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckBox;
