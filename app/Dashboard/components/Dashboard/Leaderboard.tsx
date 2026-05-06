import React from "react";

// ✅ Worker interface
interface Worker {
  id: string;
  name: string;
  age: number;
  gender: any;
  department: string;
  diagnosis: string;
  year: string; // year of admission
}

// ✅ Props interface
interface WorkerLeaderboardProps {
  data: Worker[];
  rankBy?: "age" | "year"; // optional, default to age
}

const WorkerLeaderboard: React.FC<WorkerLeaderboardProps> = ({ data, rankBy = "age" }) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  // Sort by the selected field
  const sortedData = [...data].sort((a, b) => (b[rankBy] as number) - (a[rankBy] as number));

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4">Worker Leaderboard (by {rankBy})</h2>

      <div className="overflow-y-auto h-[335px]">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-white sticky top-0 z-10">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Rank</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Worker Name & Year</th>
              <th className="border border-gray-300 px-4 py-2 text-center">{rankBy === "age" ? "Age" : "Year"}</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((p, index) => (
              <tr key={p.id}>
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{`${p.name} (${p.year})`}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">{p[rankBy]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerLeaderboard;
