"use client";

import React, { useEffect, useState } from "react";
import CommonLink from "@/app/component/CommonLink";
import { SearchCheck, Download, Edit2 } from "lucide-react";
import * as XLSX from "xlsx";

interface Worker {
  id: number;
  name: string;
  iqamaNumber: string;
  supplier: string;
  position: string;
  phone: string;
  roomNumber: string;
}

interface Room {
  roomNumber: string;
  availableSeats: number;
}

export default function WorkerRoomView() {
  const [workersByRoom, setWorkersByRoom] = useState<Record<string, Worker[]>>({});
  const [totalSeats, setTotalSeats] = useState<number>(0);

  // Fetch workers from API
  const fetchWorkers = async () => {
    try {
      const res = await fetch("http://localhost:5000/workers-all");
      const data = await res.json();

      const grouped: Record<string, Worker[]> = {};

      data.workers.forEach((worker: Worker) => {
        const room = worker.roomNumber || "N/A";
        if (!grouped[room]) {
          grouped[room] = [];
        }
        grouped[room].push(worker);
      });

      setWorkersByRoom(grouped);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  // Fetch available rooms and calculate total available seats
  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:5000/rooms/available-seats");
      const data = await res.json();

      const total = data.rooms.reduce(
        (sum: number, room: Room) => sum + room.availableSeats,
        0
      );
      setTotalSeats(total);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchWorkers();
    fetchRooms();
  }, []);

  // Sort room numbers numerically by extracting digits
  const sortedRooms = Object.keys(workersByRoom).sort((a, b) => {
    const numA = parseInt(a.replace(/^\D+/g, "")) || 0;
    const numB = parseInt(b.replace(/^\D+/g, "")) || 0;
    return numA - numB;
  });

  // Export the worker data to an Excel file
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const ws_data: any[] = [];

    ws_data.push([`WORKER ROOM DATA - ${new Date().toISOString().slice(0, 10)}`]);
    ws_data.push([]); // empty row

    sortedRooms.forEach((room) => {
      // Room title row
      ws_data.push([`CAMP ROOM NO: ${room}`]);
      // Column headers
      ws_data.push(["SL", "WORKER NAME", "IQAMA", "W.DETAIL", "PHONE", "COMPANY"]);

      workersByRoom[room].forEach((worker, index) => {
        ws_data.push([
          index + 1,
          worker.name,
          worker.iqamaNumber,
          worker.position,
          worker.phone,
          worker.supplier,
        ]);
      });

      ws_data.push([]); // empty row between rooms
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Optional: Merge the first row across all columns for title
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } }];

    XLSX.utils.book_append_sheet(workbook, ws, "Workers");
    XLSX.writeFile(workbook, `Workers_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Format the current date to display
  const formattedDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-2 mt-2 space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center bg-gray-100 border-l-4 border-gray-500 p-4 text-lg font-semibold">
        <span>📅 Date: {formattedDate}</span>
        <span>🪑 Total Available Seats: {totalSeats}</span>
        <button
          className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={exportToExcel}
        >
          <Download className="mr-1" size={18} /> Export Excel
        </button>
      </div>

      {/* Room and worker listing */}
      {sortedRooms.map((room) => (
        <div key={room} className="border rounded-md shadow-md bg-white">
          <div className="bg-gray-200 border-b px-4 py-2 text-sm font-bold">
            CAMP ROOM NO: {room}
          </div>

          <div className="flex items-center bg-primary text-white border-b border-purple-600 px-2 py-1">
            <SearchCheck className="mr-2" />
            <span className="font-semibold text-sm">Worker Room List</span>

            <div className="ml-auto">
              <CommonLink
                varient="primary"
                href={`/settings/workers/create?roomNumber=${room}`}
                title="Add Worker"
              />
            </div>
          </div>

          <div className="p-2 flex-1 overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-orange-200 text-black font-semibold">
                  <th className="border px-2 py-1 w-10">SL</th>
                  <th className="border px-2 py-1">WORKER NAME</th>
                  <th className="border px-2 py-1">IQAMA</th>
                  <th className="border px-2 py-1">W.DETAIL</th>
                  <th className="border px-2 py-1">PHONE</th>
                  <th className="border px-2 py-1">COMPANY</th>
                  <th className="border px-2 py-1">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {workersByRoom[room]?.map((worker, index) => (
                  <tr key={worker.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1 text-center">{index + 1}</td>
                    <td className="border px-2 py-1">{worker.name}</td>
                    <td className="border px-2 py-1">{worker.iqamaNumber}</td>
                    <td className="border px-2 py-1">{worker.position}</td>
                    <td className="border px-2 py-1">{worker.phone}</td>
                    <td className="border px-2 py-1">{worker.supplier}</td>
                    <td className="border px-2 py-1 text-center">
                      <CommonLink
                        varient="primary"
                        href={`/settings/workers/${worker.id}`}
                        title="Edit"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}