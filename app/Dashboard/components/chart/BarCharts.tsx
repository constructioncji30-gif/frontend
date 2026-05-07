"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import CommonRadioButton from "../CommonComponents/Button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Worker {
  name: string;
  iqamaNumber: string;
  supplier: string;
  position: string;
  phone: string;
  roomNumber: string;
}

type ViewOption = "supplier" | "position";
interface DashboardCount {
  workDetail: string;
  count: number;
}

// ⭐ ADD THIS INTERFACE
interface BarChartProps {
  data: DashboardCount[];
  title?: string;
  height?: number;
}

const  WorkerBarChart = ({ data, title = "Chart", height = 400 }: BarChartProps): JSX.Element => {

  
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewOption>("supplier");
  const [totalWorkers, setTotalWorkers] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://camp-kohl.vercel.app/dashboard");
        const data = await res.json();
        setWorkers(data.workers);
        setTotalWorkers(data.workers.length); // Set total workers count
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading chart...</p>;

  // Count workers by key
  const countMap = (key: keyof Worker) => {
    const map: Record<string, number> = {};
    workers.forEach((w) => {
      const value = w[key] || "Unknown";
      map[value] = (map[value] || 0) + 1;
    });
    return map;
  };

  const counts =
    view === "supplier" ? countMap("supplier") : countMap("position");

  // Function to generate random colors
  const generateColors = (num: number) => {
    const colors: string[] = [];
    for (let i = 0; i < num; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      colors.push(`rgba(${r},${g},${b},0.6)`);
    }
    return colors;
  };

  const chartData: ChartData<"bar"> = {
    labels: Object.keys(counts),
    datasets: [
      {
        label:
          view === "supplier" ? "Workers per Supplier" : "Workers per Position",
        data: Object.values(counts),
        backgroundColor: generateColors(Object.keys(counts).length),
        borderColor: "rgba(0,0,0,0.8)",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `${
          view === "supplier" ? "Workers per Supplier" : "Workers per Position"
        } (Total: ${totalWorkers} Workers)`,
        font: { size: 18, weight: "bold" },
      },
      legend: { display: false },
      tooltip: {
        callbacks: {
          afterLabel: function (context) {
            const value = context.parsed?.y;
            if (value === null || value === undefined) {
              return "No data";
            }
            const percentage = ((value / totalWorkers) * 100).toFixed(1);

            return `Percentage: ${percentage}%`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: view === "supplier" ? "Supplier" : "Position",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Workers",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Total Workers Display */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">
              Total Workers
            </h3>
            <p className="text-3xl font-bold text-blue-600">{totalWorkers}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-600">
              Viewing:{" "}
              <span className="font-semibold">
                {view === "supplier" ? "By Supplier" : "By Position"}
              </span>
            </p>
            <p className="text-xs text-blue-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* View Toggle Buttons */}
      <div className="flex gap-2 mb-4">
        <CommonRadioButton
          label="By Supplier"
          checked={view === "supplier"}
          onClick={() => setView("supplier")}
        />
        <CommonRadioButton
          label="By Position"
          checked={view === "position"}
          onClick={() => setView("position")}
        />
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        <Bar data={chartData} options={options} />
      </div>

      {/* Summary Statistics */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded border">
          <span className="font-semibold">Categories: </span>
          {Object.keys(counts).length}
        </div>
        <div className="bg-gray-50 p-3 rounded border">
          <span className="font-semibold">Largest Group: </span>
          {Math.max(...Object.values(counts))} workers
        </div>
        <div className="bg-gray-50 p-3 rounded border">
          <span className="font-semibold">Smallest Group: </span>
          {Math.min(...Object.values(counts))} workers
        </div>
      </div>
    </div>
  );
};

export default WorkerBarChart;
