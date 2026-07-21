"use client";

import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Worker {
  id: number;
  name: string;
  iqamaNumber: string;
  supplier: string;
  position: string;
  phone: string | null;
  dateJoined: string;
  leaveDate: string | null;
  roomNumber: string;
  MEDICAL: string;
}

interface DashboardCount {
  workDetail: string;
  count: number;
}

interface PieChartsProps {
  workers?: DashboardCount[];
  title?: string;
  height?: number;
}

const PieCharts = ({ title = "Distribution", height = 275 }: PieChartsProps) => {
  const [workers, setWorkers] = useState<DashboardCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalWorkers, setTotalWorkers] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://camp-kohl.vercel.app/dashboard");
        const data = await res.json();
        
        // Check if data is an array of workers
        if (Array.isArray(data)) {
          setTotalWorkers(data.length);
          
          // Group workers by position
          const counts = data.reduce((acc: Record<string, number>, worker: Worker) => {
            const key = worker.position || 'Unknown';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});
          
          const transformedData = Object.entries(counts).map(([key, value]) => ({
            workDetail: key,
            count: value as number
          }));
          
          setWorkers(transformedData);
        } else if (data && data.workers && Array.isArray(data.workers)) {
          // If data has a workers property
          setTotalWorkers(data.workers.length);
          
          const counts = data.workers.reduce((acc: Record<string, number>, worker: Worker) => {
            const key = worker.position || 'Unknown';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});
          
          const transformedData = Object.entries(counts).map(([key, value]) => ({
            workDetail: key,
            count: value as number
          }));
          
          setWorkers(transformedData);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate total for percentages
  const total = workers.reduce((sum, item) => sum + item.count, 0);

  // Default colors array
  const defaultColors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#8A2BE2", "#00FF7F", "#E7E9ED", "#FF6B6B",
    "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD",
    "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", "#F1948A"
  ];

  const chartData: ChartData<"pie"> = {
    labels: workers.map((d) => d.workDetail),
    datasets: [
      {
        data: workers.map((d) => d.count),
        backgroundColor: workers.map((_, index) => 
          defaultColors[index % defaultColors.length]
        ),
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "left",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 11
          }
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="h-[275px] flex items-center justify-center">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      </div>
    );
  }

  if (workers.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="h-[275px] flex items-center justify-center">
          <div className="text-gray-500">No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
          {title}
        </h3>
      )}
      
      {/* Summary Stats */}
      <div className="mb-3 text-center">
        <div className="inline-flex items-center bg-blue-50 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-blue-800">
            Total Workers: <strong>{total}</strong>
          </span>
        </div>
      </div>

      <div style={{ height: `${height}px` }}>
        <Pie data={chartData} options={options} />
      </div>

      {/* Additional Statistics */}
      {workers.length > 0 && (
        <div className="mt-3 text-xs text-gray-600 text-center">
          <span>
            Positions: <strong>{workers.length}</strong>
            {workers.length > 0 && (
              <>
                {" "}• Largest: <strong>{Math.max(...workers.map(d => d.count))}</strong>
                {" "}• Smallest: <strong>{Math.min(...workers.map(d => d.count))}</strong>
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default PieCharts;