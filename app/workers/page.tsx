"use client";

import React, { useEffect, useState } from "react";
import CommonLink from "@/app/component/CommonLink";
import {
  SearchCheck,
  Download,
  AlertTriangle,
  Calendar,
  Trash2,
  Check,
  X,
  EyeClosed,
} from "lucide-react";
import * as XLSX from "xlsx";

interface Worker {
  id: number;
  name: string;
  iqamaNumber: string;
  supplier: string;
  position: string;
  phone: string;
  roomNumber: string;
  leaveDate?: string;
  dateJoined?: string;
  MEDICAL?: string;
}

interface Room {
  roomNumber: string;
  availableSeats: number;
}

export default function WorkerRoomView() {
  const [workersByRoom, setWorkersByRoom] = useState<Record<string, Worker[]>>(
    {},
  );
  const [totalSeats, setTotalSeats] = useState<number>(0);
    const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roomSearchTerm, setRoomSearchTerm] = useState<string>("");
  const [medicalSearch, setMedicalSearch] = useState<string>("");
    const [PASSWORD, setPASSWORD] = useState<any>("");

  // Tab state
  const [activeTab, setActiveTab] = useState<
    "ALL" | "B" | "C" | "LEFT" | "NEW_JOINED"
  >("ALL");

  // Fetch workers
  const fetchWorkers = async () => {
    setLoading(false);
    try {
      const res = await fetch("https://camp-kohl.vercel.app/workers-all");
      const data = await res.json();

      const grouped: Record<string, Worker[]> = {};

      data.workers.forEach((worker: Worker) => {
        const room = worker.roomNumber || "N/A";
        if (!grouped[room]) grouped[room] = [];
        grouped[room].push(worker);
        
      });

      setWorkersByRoom(grouped);
      setLoading(true);
    } catch (error) {
      setLoading(true);
      console.error("Error fetching workers:", error);
    }
  };

  // Fetch available rooms
  const fetchRooms = async () => {
    setLoading(false);
    try {
      const res = await fetch("https://camp-kohl.vercel.app/rooms/available-seats");
      const data = await res.json();

      const total = data.rooms.reduce(
        (sum: number, room: Room) => sum + room.availableSeats,
        0,
      );
      setTotalSeats(total);
     
    } catch (error) {
      
      console.error("Error fetching rooms:", error);
    }
  };

  // Delete worker
  const deleteWorker = async (id: number, roomNumber: string) => {
    if (!confirm("Are you sure you want to delete this worker?")) return;
    setLoading(false);

    try {
      const res = await fetch(`https://camp-kohl.vercel.app/workers/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setWorkersByRoom((prev) => {
          const updatedRoom = prev[roomNumber].filter((w) => w.id !== id);
          return { ...prev, [roomNumber]: updatedRoom };
        });
    setLoading(true);  } else {
        alert(`Error: ${data.error}`);
        setLoading(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete worker");
      setLoading(true);
    }
  };

  // Toggle MEDICAL status
  const toggleMedical = async (id: number, currentStatus: string | undefined) => {
    const newStatus = currentStatus?.toUpperCase() === "YES" ? "NO" : "YES";
    
    if (!confirm(`Are you sure you want to mark this worker as MEDICAL: ${newStatus}?`)) return;
setLoading(false);
    try {
      const res = await fetch(`https://camp-kohl.vercel.app/workers/${id}/medical`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ MEDICAL: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchWorkers(); // Refresh the workers data
      } else {
        alert(`Error: ${data.error}`);
      }
      setLoading(true);
    } catch (err) {
      console.error(err);
      alert("Failed to update medical status");
      setLoading(true);
    }
  };

  // Mark worker as left
  const markAsLeft = async (id: number, roomNumber: string) => {
    const leaveDate = new Date().toISOString().split("T")[0];

    if (!confirm("Are you sure you want to mark this worker as left?")) return;
setLoading(false);
    try {
      const res = await fetch(`https://camp-kohl.vercel.app/workers/${id}/leave`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leaveDate }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchWorkers();
      } else {
        alert(`Error: ${data.error}`);
      }
setLoading(true);    } catch (err) {
      console.error(err);
      alert("Failed to mark worker as left");
   setLoading(true); }
  };

  // Reactivate worker
  const reactivateWorker = async (id: number, roomNumber: string) => {
    if (!confirm("Are you sure you want to reactivate this worker?")) return;

    try {
      const res = await fetch(
        `https://camp-kohl.vercel.app/workers/${id}/reactivate`,
        {
          method: "PUT",
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        fetchWorkers();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reactivate worker");
    }
  };

  useEffect(() => {
    fetchWorkers();
    fetchRooms();
  }, []);

  const [duplicateList, setDuplicateList] = useState<Worker[]>([]);
  const [showDuplicates, setShowDuplicates] = useState(false);

  const fetchDuplicates = async () => {
    try {
      const res = await fetch("https://camp-kohl.vercel.app/workers-duplicates");
      const data = await res.json();
      setDuplicateList(data.duplicates);
      setShowDuplicates(true);
    } catch (error) {
      console.error("Error fetching duplicates:", error);
    }
  };

  // Check if room is overcrowded
  const isRoomOvercrowded = (roomNumber: string): boolean => {
    const workersInRoom = workersByRoom[roomNumber] || [];
    const activeWorkers = workersInRoom.filter((worker) => !worker.leaveDate);
    return activeWorkers.length > 6;
  };

  // Get overcrowded count
  const getOvercrowdedCount = (roomNumber: string): number => {
    const workersInRoom = workersByRoom[roomNumber] || [];
    const activeWorkers = workersInRoom.filter((worker) => !worker.leaveDate);
    return Math.max(0, activeWorkers.length - 6);
  };

  // Check if worker is newly joined
  const isNewlyJoined = (worker: Worker): boolean => {
    if (!worker.dateJoined) return false;

    const joinDate = new Date(worker.dateJoined);
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return joinDate >= thirtyDaysAgo && joinDate <= today;
  };

  // Sort rooms
  const sortRooms = (rooms: string[]): string[] => {
    return rooms.sort((a, b) => {
      const aMatch = a.match(/^([BC])(?:-)?(\d+)(?:-(\d+))?$/);
      const bMatch = b.match(/^([BC])(?:-)?(\d+)(?:-(\d+))?$/);

      if (!aMatch || !bMatch) return a.localeCompare(b);

      const aBuilding = aMatch[1];
      const bBuilding = bMatch[1];
      const aMainNum = parseInt(aMatch[2]);
      const bMainNum = parseInt(bMatch[2]);
      const aSubNum = aMatch[3] ? parseInt(aMatch[3]) : 0;
      const bSubNum = bMatch[3] ? parseInt(bMatch[3]) : 0;

      if (aBuilding !== bBuilding) {
        return aBuilding === "B" ? -1 : 1;
      }

      if (aMainNum !== bMainNum) {
        return aMainNum - bMainNum;
      }

      return aSubNum - bSubNum;
    });
  };

  // Filter rooms
  const filteredRoomKeys = Object.keys(workersByRoom).filter(
    (room) => room.startsWith("B") || room.startsWith("C"),
  );

  const sortedRooms = sortRooms(filteredRoomKeys);

  const getFilteredRooms = () => {
    if (!roomSearchTerm) return sortedRooms;
    return sortedRooms.filter((room) =>
      room.toLowerCase().includes(roomSearchTerm.toLowerCase()),
    );
  };

  const filteredRooms = getFilteredRooms();

  // Filter workers based on tab and search
  const getFilteredWorkersByRoom = () => {
    const filteredRoomsToUse =
      activeTab === "ALL"
        ? filteredRooms
        : activeTab === "LEFT"
        ? filteredRooms
        : activeTab === "NEW_JOINED"
        ? filteredRooms
        : filteredRooms.filter((room) => room.startsWith(activeTab));

    if (activeTab === "LEFT") {
      const leftWorkersByRoom: Record<string, Worker[]> = {};

      filteredRoomsToUse.forEach((room) => {
        const leftWorkers =
          workersByRoom[room]?.filter(
            (worker) =>
              worker.leaveDate &&
              (worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                worker.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                worker.iqamaNumber?.includes(searchTerm)) &&
              (medicalSearch === "" || worker.MEDICAL?.toUpperCase() === medicalSearch)
          ) || [];

        if (leftWorkers.length > 0) {
          leftWorkersByRoom[room] = leftWorkers;
        }
      });

      return leftWorkersByRoom;
    } else if (activeTab === "NEW_JOINED") {
      const newJoinedWorkersByRoom: Record<string, Worker[]> = {};

      filteredRoomsToUse.forEach((room) => {
        const newJoinedWorkers =
          workersByRoom[room]?.filter(
            (worker) =>
              !worker.leaveDate &&
              isNewlyJoined(worker) &&
              (worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                worker.iqamaNumber?.includes(searchTerm)) &&
              (medicalSearch === "" || worker.MEDICAL?.toUpperCase() === medicalSearch)
          ) || [];

        if (newJoinedWorkers.length > 0) {
          newJoinedWorkersByRoom[room] = newJoinedWorkers;
        }
      });

      return newJoinedWorkersByRoom;
    } else {
      const filtered: Record<string, Worker[]> = {};

      filteredRoomsToUse.forEach((room) => {
        const filteredWorkers =
          workersByRoom[room]?.filter(
            (worker) =>
              !worker.leaveDate &&
              (worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                worker.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                worker.iqamaNumber?.includes(searchTerm)) &&
              (medicalSearch === "" || worker.MEDICAL?.toUpperCase() === medicalSearch)
          ) || [];

        if (filteredWorkers.length > 0) {
          filtered[room] = filteredWorkers;
        }
      });

      return filtered;
    }
  };

  const visibleRooms =
    activeTab === "ALL"
      ? filteredRooms
      : activeTab === "LEFT"
      ? filteredRooms
      : activeTab === "NEW_JOINED"
      ? filteredRooms
      : filteredRooms.filter((room) => room.startsWith(activeTab));

  const filteredWorkersByRoom = getFilteredWorkersByRoom();

  const newJoinedCount = Object.values(workersByRoom)
    .flat()
    .filter((worker) => !worker.leaveDate && isNewlyJoined(worker)).length;

  // Export to Excel
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const ws_data: any[] = [];

    const tabTitle =
      activeTab === "LEFT"
        ? "LEFT WORKERS"
        : activeTab === "NEW_JOINED"
        ? "NEWLY JOINED WORKERS"
        : "ACTIVE WORKERS";

    const searchInfo = roomSearchTerm
      ? ` (Filtered by Room: ${roomSearchTerm})`
      : "";
    ws_data.push([
      `${tabTitle} - ${new Date().toISOString().slice(0, 10)}${searchInfo}`,
    ]);
    ws_data.push([]);

    const roomsToExport = activeTab === "ALL" ? filteredRooms : visibleRooms;

    roomsToExport.forEach((room) => {
      let filteredWorkers;

      if (activeTab === "LEFT") {
        filteredWorkers = workersByRoom[room]?.filter(
          (worker) =>
            worker.leaveDate &&
            (medicalSearch === "" || worker.MEDICAL?.toUpperCase() === medicalSearch)
        );
      } else if (activeTab === "NEW_JOINED") {
        filteredWorkers = workersByRoom[room]?.filter(
          (worker) =>
            !worker.leaveDate &&
            isNewlyJoined(worker) &&
            (medicalSearch === "" || worker.MEDICAL?.toUpperCase() === medicalSearch)
        );
      } else {
        filteredWorkers = workersByRoom[room]?.filter(
          (worker) =>
            !worker.leaveDate &&
            (medicalSearch === "" || worker.MEDICAL?.toUpperCase() === medicalSearch)
        );
      }

      if (!filteredWorkers || filteredWorkers.length === 0) return;

      const overcrowdedWarning = isRoomOvercrowded(room)
        ? ` ⚠ OVERCROWDED (+${getOvercrowdedCount(room)})`
        : "";

      ws_data.push([`CAMP ROOM NO: ${room}${overcrowdedWarning}`]);
      ws_data.push([
        "SL",
        "WORKER NAME",
        "IQAMA",
        "W.DETAIL",
        "PHONE",
        "COMPANY",
        "JOIN DATE",
        "LEAVE DATE",
        "MEDICAL",
        "ROOM Number",
      ]);

      filteredWorkers.forEach((worker, index) => {
        ws_data.push([
          index + 1,
          worker.name,
          worker.iqamaNumber,
          worker.position,
          worker.phone,
          worker.supplier,
          worker.dateJoined?.split("T")[0] || " ",
          worker.leaveDate || "Active",
          worker.MEDICAL || "NO",
          worker.roomNumber,
        ]);
      });

      ws_data.push([]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

    const sheetName =
      activeTab === "LEFT"
        ? "Left Workers"
        : activeTab === "NEW_JOINED"
        ? "Newly Joined Workers"
        : "Active Workers";

    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
    XLSX.writeFile(
      workbook,
      `Workers_${activeTab}_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  const formattedDate = new Date().toISOString().slice(0, 10);

  return !loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading please wait...</p>
        </div> ):
    (<div className="mx-2 mt-2 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 border-l-4 border-gray-500 p-4 text-lg font-semibold flex-wrap gap-2">
        <span>📅 Date: {formattedDate}</span>
        <span>🪑 Total Available Seats: {totalSeats}</span>
        <span>Total Labour: {Object.values(filteredWorkersByRoom).flat().length}</span>
        {activeTab === "LEFT" ? (
          <p>Left Workers: {Object.values(filteredWorkersByRoom).flat().length}</p>
        ) : (
          <span>🆕 New Joined: {newJoinedCount}</span>
        )}

        <button
          className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
          // onClick={exportToExcel}
        >
          <Download className="mr-1" size={18} /> Export Excel
        </button>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-4 w-auto border-b pb-2 flex-wrap">
        {["ALL", "B", "C", "NEW_JOINED", "LEFT"].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(tab as "ALL" | "B" | "C" | "LEFT" | "NEW_JOINED")
            }
            className={`px-4 py-[0.5px] rounded-full font-semibold ${
              activeTab === tab
                ? tab === "LEFT"
                  ? "bg-red-600 text-white"
                  : tab === "NEW_JOINED"
                  ? "bg-green-600 text-white"
                  : "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {tab === "NEW_JOINED" ? (
              <span className="flex items-center">
                <Calendar className="mr-1" size={16} />
                NEW JOINED
              </span>
            ) : (
              `${tab} ${tab === "LEFT" ? "WORKERS" : ""}`
            )}
          </button>
        ))}
        {/* <button
          onClick={
            showDuplicates
              ? () => setShowDuplicates(false)
              : () => fetchDuplicates()
          }
          className="bg-red-600 text-xs text-white px-2 py-[0.5px] rounded-full hover:bg-red-700"
        >
          Show Duplicate Iqama Workers
        </button> */}
      </div>

      {/* Search Inputs - CORRECTED MEDICAL SEARCH */}
      <div className="flex gap-4 flex-wrap items-end">
        {/* MEDICAL SEARCH - Radio Buttons */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Filter by Medical</label>
          <div className="flex gap-4 border rounded-full px-4 py-2 bg-white">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="medicalFilter"
                value=""
                checked={medicalSearch === ""}
                onChange={() => setMedicalSearch("")}
                className="cursor-pointer"
              />
              <span>ALL</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="medicalFilter"
                value="YES"
                checked={medicalSearch === "YES"}
                onChange={() => setMedicalSearch("YES")}
                className="cursor-pointer"
              />
              <span className="text-green-600 font-semibold">YES</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="medicalFilter"
                value="NO"
                checked={medicalSearch === "NO"}
                onChange={() => setMedicalSearch("NO")}
                className="cursor-pointer"
              />
              <span className="text-red-600 font-semibold">NO</span>
            </label>
          </div>
        </div>

        {/* Search by Name or Iqama */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Search by Name or Iqama</label>
          <input
            type="text"
            placeholder="Search worker..."
            className="border px-3 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
 <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">PASSWORD</label>
          <input
            type="text"
            placeholder="ENTER PASSWORD TO SEE"
            className="border px-3 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={PASSWORD}
            onChange={(e) => setPASSWORD(e.target.value)}
          />
        </div>
        {/* Search by Room */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Search by Room</label>
          <input
            type="text"
            placeholder="Search room (e.g., B-15, C-25)..."
            className="border px-3 py-2 rounded-full w-48 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={roomSearchTerm}
            onChange={(e) => setRoomSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Room Search Filter Info */}
      {roomSearchTerm && (
        <div className="bg-blue-50 border border-blue-200 rounded-full p-3">
          <div className="flex justify-between items-center">
            <span className="text-blue-800 font-medium">
              Showing rooms containing: <strong>"{roomSearchTerm}"</strong>
            </span>
            <button
              onClick={() => setRoomSearchTerm("")}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear Room Filter
            </button>
          </div>
          <div className="text-blue-600 text-sm mt-1">
            Found {Object.keys(filteredWorkersByRoom).length} rooms with{" "}
            {Object.values(filteredWorkersByRoom).flat().length} workers
          </div>
        </div>
      )}

      {/* New Joined Info */}
      {activeTab === "NEW_JOINED" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="text-green-500 mr-2" size={20} />
            <span className="text-green-800 font-semibold">
              Newly Joined Workers (Last 30 Days)
            </span>
          </div>
          <div className="text-green-600 text-sm mt-1">
            Showing {Object.values(filteredWorkersByRoom).flat().length} workers
            who joined in the last 30 days
          </div>
        </div>
      )}

      {/* Duplicates Table */}
      {showDuplicates && activeTab !== "LEFT" && (
        <div className="p-4 mt-4">
          <h2 className="text-lg font-bold mb-2">Duplicate Workers (Iqama Based)</h2>
          {duplicateList.length === 0 ? (
            <p className="text-gray-700">No duplicates found.</p>
          ) : (
            <table className="text-sm border-collapse w-full">
              <thead className="bg-yellow-200">
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Iqama</th>
                  <th className="border px-2 py-1">Supplier</th>
                  <th className="border px-2 py-1">Room</th>
                </tr>
              </thead>
              <tbody>
                {duplicateList.map((w) => (
                  <tr key={w.id}>
                    <td className="border px-2 py-1">{w.name}</td>
                    <td className="border px-2 py-1 font-bold text-red-600">
                      {w.iqamaNumber}
                    </td>
                    <td className="border px-2 py-1">{w.supplier}</td>
                    <td className="border px-2 py-1">{w.roomNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Overcrowded Rooms Warning */}
      {activeTab !== "LEFT" &&
        activeTab !== "NEW_JOINED" &&
        Object.keys(filteredWorkersByRoom).some((room) =>
          isRoomOvercrowded(room),
        ) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="text-red-500 mr-2" size={20} />
              <span className="text-red-800 font-semibold">
                Overcrowded Rooms Detected!
              </span>
            </div>
            <div className="text-red-600 text-sm mt-1">
              The following rooms have more than 6 workers:{" "}
              {Object.keys(filteredWorkersByRoom)
                .filter((room) => isRoomOvercrowded(room))
                .map((room) => `${room} (+${getOvercrowdedCount(room)})`)
                .join(", ")}
            </div>
          </div>
        )}

      {/* Room Tables */}
      <div className="overflow-auto max-h-[590px]">
        {Object.keys(filteredWorkersByRoom).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {activeTab === "LEFT"
              ? "No left workers found"
              : activeTab === "NEW_JOINED"
              ? "No newly joined workers found (last 30 days)"
              : roomSearchTerm
              ? `No rooms found containing "${roomSearchTerm}"`
              : "No workers found for the selected criteria"}
          </div>
        ) : (
          Object.keys(filteredWorkersByRoom).map((room) => {
            const filteredWorkers = filteredWorkersByRoom[room];
            const isOvercrowded = isRoomOvercrowded(room);
            const overcrowdedCount = getOvercrowdedCount(room);

            return (
              <div
                key={room}
                className={`border rounded-lg flex-1 shadow-md bg-white mb-4 ${
                  isOvercrowded && activeTab !== "NEW_JOINED"
                    ? "ring-2 ring-red-500"
                    : ""
                }`}
              >
                {/* Room Header */}
                <div
                  className={`border-b px-4 py-2 text-sm font-bold ${
                    isOvercrowded && activeTab !== "NEW_JOINED"
                      ? "bg-red-100"
                      : activeTab === "LEFT"
                      ? "bg-red-200"
                      : activeTab === "NEW_JOINED"
                      ? "bg-green-200"
                      : "bg-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>
                      CAMP ROOM NO: {room}
                      {activeTab === "LEFT" && (
                        <span className="ml-2 text-red-600 text-xs">
                          (Left Workers)
                        </span>
                      )}
                      {activeTab === "NEW_JOINED" && (
                        <span className="ml-2 text-green-600 text-xs">
                          (Newly Joined)
                        </span>
                      )}
                    </span>

                    {isOvercrowded &&
                      activeTab !== "LEFT" &&
                      activeTab !== "NEW_JOINED" && (
                        <div className="flex items-center bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          <AlertTriangle size={12} className="mr-1" />
                          OVERCROWDED +{overcrowdedCount}
                        </div>
                      )}
                  </div>
                </div>

                {/* Sub-header */}
                <div
                  className={`flex items-center border-b px-2 py-1 ${
                    isOvercrowded && activeTab !== "NEW_JOINED"
                      ? "bg-red-500 text-white"
                      : activeTab === "LEFT"
                      ? "bg-red-500 text-white"
                      : activeTab === "NEW_JOINED"
                      ? "bg-green-500 text-white"
                      : "bg-primary text-white"
                  }`}
                >
                  <SearchCheck className="mr-2" />
                  <span className="font-semibold text-sm">
                    {activeTab === "LEFT"
                      ? "Left Workers List"
                      : activeTab === "NEW_JOINED"
                      ? "Newly Joined Workers List"
                      : "Worker Room List"}
                    {isOvercrowded && activeTab !== "NEW_JOINED" && " ⚠"}
                  </span>
                  <div className="ml-auto">
                    {activeTab !== "LEFT" && activeTab !== "NEW_JOINED" && (
                      <CommonLink
                        varient="primary"
                        href={`/workers/create/${room}`}
                        title="Add Worker"
                      />
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="p-2 overflow-x-auto">
                  <table className="w-full border-collapse text-sm min-w-[800px]">
                    <thead>
                      <tr
                        className={`text-black font-semibold ${
                          isOvercrowded
                            ? "bg-red-50"
                            : activeTab === "LEFT"
                            ? "bg-red-100"
                            : activeTab === "NEW_JOINED"
                            ? "bg-green-100"
                            : "bg-orange-200"
                        }`}
                      >
                        <th className="border px-2 py-1 w-10">SL</th>
                        <th className="text-start border px-2 py-1">WORKER NAME</th>
                        <th className="text-start border px-2 py-1">IQAMA</th>
                        <th className="text-start border px-2 py-1">W.DETAIL</th>
                        <th className="text-start border px-2 py-1">PHONE</th>
                        <th className="text-start border px-2 py-1">COMPANY</th>
                        <th className="text-start border px-2 py-1">JOIN DATE</th>
                        <th className="text-start border px-2 py-1">MEDICAL</th>
                        {activeTab === "LEFT" && (
                          <th className="text-start border px-2 py-1">LEFT DATE</th>
                        )}
                        <th className="text-start border px-2 py-1">ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredWorkers.map((worker, index) => (
                        <tr
                          key={worker.id}
                          className={`hover:bg-gray-50 ${
                            isOvercrowded && index >= 6 ? "bg-red-50" : ""
                          }`}
                        >
                          <td className="border px-2 py-1 text-center">
                            {index + 1}
                          </td>
                          <td className="border px-2 py-1">
                            <div className="flex items-center">
                              {activeTab === "NEW_JOINED" && (
                                <span
                                  className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"
                                  title="Newly Joined"
                                ></span>
                              )}
                              {worker.name?.toUpperCase()}
                            </div>
                          </td>
                          <td className="border px-2 py-1 text-green-500">
                            {PASSWORD==2344?worker.iqamaNumber :<EyeClosed size={10}/>} 
                          </td>l
                          <td className="border px-2 py-1">
                            {worker.position?.toUpperCase()}
                          </td>
                          <td className="border px-2 py-1">{worker.phone}</td>
                          <td className="border px-2 py-1">
                            {/* {worker.supplier?.toUpperCase()} */}
                            COMPANY
                          </td>
                          <td className="border px-2 py-1">
                            {worker.dateJoined ? (
                              <span
                                className={
                                  isNewlyJoined(worker)
                                    ? "text-green-600 font-semibold"
                                    : ""
                                }
                              >
                                {worker.dateJoined.split("T")[0]}
                                {isNewlyJoined(worker) && " 🆕"}
                              </span>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="border px-2 py-1">
                            <button
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                                worker.MEDICAL?.toUpperCase() === "YES"
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                              // onClick={() => toggleMedical(worker.id, worker.MEDICAL)}
                            >
                              {worker.MEDICAL?.toUpperCase() === "YES" ? (
                                <>
                                  <Check size={12} /> YES
                                </>
                              ) : (
                                <>
                                  <X size={12} /> NO
                                </>
                              )}
                            </button>
                          </td>
                          {activeTab === "LEFT" && (
                            <td className="border px-2 py-1 text-red-600 font-semibold">
                              {worker?.leaveDate?.split("T")[0]}
                            </td>
                          )}
                          <td className="border px-1 py-1 text-center">
                            <div className="flex justify-end gap-2">
                              {activeTab === "LEFT" ? (
                                <>
                                  <CommonLink
                                    varient="primary"
                                    href={`/workers/${worker.id}`}
                                    title="Edit"
                                  />
                                  <button
                                    className="bg-green-500 text-white px-2 py-[1px] rounded-full hover:bg-green-600 text-xs"
                                    // onClick={() =>
                                    //   reactivateWorker(worker.id, room)
                                    // }
                                  >
                                    Reactivate
                                  </button>
                                  <button
                                    className="bg-red-500 text-white px-2 py-[1px] rounded-full hover:bg-red-600"
                                    // onClick={() => deleteWorker(worker.id, room)}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <CommonLink
                                    varient="primary"
                                    href={`/workers`}
                                    title="Edit"
                                  />
                                  <button
                                    className="bg-orange-500 text-white px-2 py-[1px] rounded-full hover:bg-orange-600 text-xs"
                                    // onClick={() => markAsLeft(worker.id, room)}
                                  >
                                    Mark as Left
                                  </button>
                                  <button
                                    className="bg-red-500 text-white px-2 py-[1px] rounded-full hover:bg-red-600"
                                    // onClick={() => deleteWorker(worker.id, room)}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}