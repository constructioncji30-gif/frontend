"use client";

import React from "react";
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

interface DashboardCount {
  workDetail: string;
  count: number;
}

interface PieChartsProps {
  data: DashboardCount[];
  title?: string;
  height?: number;
}

const PieCharts = ({ data, title = "Distribution", height = 275 }: PieChartsProps) => {
  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const chartData: ChartData<"pie"> = {
    labels: data.map((d) => `${d.workDetail} (${d.count})`),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          "#FF9F40", "#8A2BE2", "#00FF7F", "#E7E9ED", "#FF6384",
          "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
        ],
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
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
  };

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
            Total: <strong>{total}</strong>
          </span>
        </div>
      </div>

      <div style={{ height: `${height}px` }}>
        <Pie data={chartData} options={options} />
      </div>

      {/* Additional Statistics */}
      {data.length > 0 && (
        <div className="mt-3 text-xs text-gray-600 text-center">
          <span>
            Categories: <strong>{data.length}</strong> • 
            Largest: <strong>{Math.max(...data.map(d => d.count))}</strong> • 
            Smallest: <strong>{Math.min(...data.map(d => d.count))}</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default PieCharts;