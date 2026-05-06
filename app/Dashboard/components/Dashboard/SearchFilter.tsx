
import React, { useState, ChangeEvent } from "react";
import CommonRadioButton from "../CommonComponents/Button";

// ✅ Worker interface
interface Worker {
  id: string;
  name: string;
  age: number;
  gender:  string
  department: string;
  diagnosis: string;
  year: string; // or number if needed
}

// ✅ Component props
interface WorkerSearchFilterProps {
  data: Worker[];
  showFilters?: boolean;
}

const WorkerSearchFilter: React.FC<WorkerSearchFilterProps> = ({ data, showFilters = true }) => {
  const [state, setState] = useState({
    searchQuery: "",
    selectedDepartments: [] as string[],
    selectedYear: "",
    selectedGender: "" as "Male" | "Female" | "",
  });

  const uniqueDepartments = [...new Set(data.map((p:any) => p.department))];
  const uniqueYears = [...new Set(data.map((p:any) => p.year))];
  const genders: ("Male" | "Female")[] = ["Male", "Female"];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleDepartmentChange = (dept: string) => {
    setState((prev) => ({
      ...prev,
      selectedDepartments: prev.selectedDepartments.includes(dept)
        ? prev.selectedDepartments.filter((d) => d !== dept)
        : [...prev.selectedDepartments, dept],
    }));
  };

  const handleYearChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setState((prev) => ({ ...prev, selectedYear: e.target.value }));
  };

  const handleGenderChange = (gender: "Male" | "Female") => {
    setState((prev) => ({ ...prev, selectedGender: gender }));
  };

  const filteredData = data.filter((p:any) => {
    const matchName = p.name.toLowerCase().includes(state.searchQuery.toLowerCase());
    const matchDept = state.selectedDepartments.length
      ? state.selectedDepartments.includes(p.department)
      : true;
    const matchYear = state.selectedYear ? p.year === state.selectedYear : true;
    const matchGender = state.selectedGender ? p.gender === state.selectedGender : true;
    return matchName && matchDept && matchYear && matchGender;
  });

  return (
    <div className="bg-white px-4 py-2">
      {showFilters && (
        <>
          {/* Search by Name */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name"
              value={state.searchQuery}
              onChange={handleSearchChange}
              className="w-full border px-2 py-1 rounded-lg"
            />
          </div>

          {/* Department Filters (multi-select using radio-style checkbox) */}
          {/* <div className="mb-4 flex flex-wrap gap-2">
            {uniqueDepartments.map((dept) => (
              <CommonRadioButton
                key={dept}
                label={dept}
                value={dept}
                checked={state.selectedDepartments.includes(dept)}
                onClick={() => handleDepartmentChange(dept)}
              />
            ))}
          </div> */}

          {/* Year Filter */}
          <div className="mb-4">
            <select
              value={state.selectedYear}
              onChange={handleYearChange}
              className="border px-2 py-1 rounded-lg"
            >
              <option value="">Select Year</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="mb-4 flex gap-2">
            {genders.map((gender) => (
              <CommonRadioButton
                key={gender}
                label={gender}
                value={gender}
                checked={state.selectedGender === gender}
                onClick={() => handleGenderChange(gender)}
              />
            ))}
          </div>
        </>
      )}

       <div className="overflow-y-auto h-[335px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length > 0 ? (
          filteredData.map((p:any) => (
            <div key={p.id} className="p-4 bg-gray-100 rounded-lg shadow cursor-pointer">
              <h4 className="font-bold">{p.name}</h4>
              <p><strong>Age:</strong> {p.age}</p>
              <p><strong>Gender:</strong> {p.gender}</p>
              <p><strong>Department:</strong> {p.department}</p>
              <p><strong>Diagnosis:</strong> {p.diagnosis}</p>
              <p><strong>Year:</strong> {p.year}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">No workers found.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default WorkerSearchFilter;
