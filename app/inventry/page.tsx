"use client";

import React, { useEffect, useState } from "react";
import CommonLink from "@/app/component/CommonLink";
import { SearchCheck, Download, Plus, Edit, Trash2, User } from "lucide-react";
import * as XLSX from "xlsx";

interface Staff {
  id: number;
  name: string;
  roomNumber: string;
  designation: string;
  phone: string;
  email: string;
  department: string;
  dateJoined: string;
  leaveDate?: string;
}

export default function StaffRoomView() {
  const [staffByRoom, setStaffByRoom] = useState<Record<string, Staff[]>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roomSearchTerm, setRoomSearchTerm] = useState<string>("");

  // ⭐ TAB STATE
  const [activeTab, setActiveTab] = useState<"ALL" | "B" | "LEFT">("ALL");

  // Fetch staff - Updated to fetch all staff including left ones
  const fetchStaff = async () => {
    try {
      const res = await fetch("https://camp-kohl.vercel.app/staff-all");
      const data = await res.json();

      const grouped: Record<string, Staff[]> = {};

      data.staff.forEach((staff: Staff) => {
        const room = staff.roomNumber || "N/A";
        if (!grouped[room]) grouped[room] = [];
        grouped[room].push(staff);
      });

      setStaffByRoom(grouped);
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  // Delete staff
  const deleteStaff = async (id: number, roomNumber: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    try {
      const res = await fetch(`https://camp-kohl.vercel.app/staff/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        setStaffByRoom((prev) => {
          const updatedRoom = prev[roomNumber].filter((s) => s.id !== id);
          return { ...prev, [roomNumber]: updatedRoom };
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete staff");
    }
  };

  // ⭐ MARK STAFF AS LEFT
  const markAsLeft = async (id: number, roomNumber: string) => {
    const leaveDate = new Date().toISOString().split('T')[0];  
    
    if (!confirm("Are you sure you want to mark this staff as left?")) return;

    try {
      const res = await fetch(`https://camp-kohl.vercel.app/staff/${id}/leave`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leaveDate })
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        // Refresh the staff data
        fetchStaff();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to mark staff as left");
    }
  };

  // ⭐ REACTIVATE STAFF
  const reactivateStaff = async (id: number, roomNumber: string) => {
    if (!confirm("Are you sure you want to reactivate this staff member?")) return;

    try {
      const res = await fetch(`https://camp-kohl.vercel.app/staff/${id}/reactivate`, {
        method: "PUT",
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        // Refresh the staff data
        fetchStaff();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reactivate staff");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // ⭐ PROPER ROOM SORTING FUNCTION
  const sortRooms = (rooms: string[]): string[] => {
    return rooms.sort((a, b) => {
      // Extract building letter and number
      const aMatch = a.match(/^([B])(?:-)?(\d+)$/);
      const bMatch = b.match(/^([B])(?:-)?(\d+)$/);
      
      if (!aMatch || !bMatch) return a.localeCompare(b);
      
      const aBuilding = aMatch[1];
      const bBuilding = bMatch[1];
      const aMainNum = parseInt(aMatch[2]);
      const bMainNum = parseInt(bMatch[2]);
      
      // First sort by building (only B for staff)
      if (aBuilding !== bBuilding) {
        return aBuilding === 'B' ? -1 : 1;
      }
      
      // Then by room number
      return aMainNum - bMainNum;
    });
  };

  // ⭐ AUTO-DETECT ONLY B ROOMS (staff are in B rooms)
  const filteredRoomKeys = Object.keys(staffByRoom).filter(
    (room) => room.startsWith("B")
  );

  const sortedRooms = sortRooms(filteredRoomKeys);

  // ⭐ FILTER ROOMS BASED ON ROOM SEARCH TERM
  const getFilteredRooms = () => {
    if (!roomSearchTerm) return sortedRooms;
    
    return sortedRooms.filter(room => 
      room.toLowerCase()?.includes(roomSearchTerm.toLowerCase())
    );
  };

  const filteredRooms = getFilteredRooms();

  // ⭐ Filter staff based on leave status for LEFT tab
  const getFilteredStaffByRoom = () => {
    const filteredRoomsToUse = activeTab === "ALL" 
      ? filteredRooms 
      : activeTab === "LEFT" 
        ? filteredRooms 
        : filteredRooms.filter((room) => room.startsWith(activeTab));

    if (activeTab === "LEFT") {
      const leftStaffByRoom: Record<string, Staff[]> = {};
      
      filteredRoomsToUse.forEach(room => {
        const leftStaff = staffByRoom[room]?.filter(staff => 
          staff.leaveDate && 
          (staff.name.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
           staff.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           staff.department?.toLowerCase().includes(searchTerm.toLowerCase()))
        ) || [];
        
        if (leftStaff.length > 0) {
          leftStaffByRoom[room] = leftStaff;
        }
      });
      
      return leftStaffByRoom;
    } else {
      const filtered: Record<string, Staff[]> = {};
      
      filteredRoomsToUse.forEach(room => {
        const filteredStaff = staffByRoom[room]?.filter(
          (staff) =>
            !staff.leaveDate && // Only active staff for non-LEFT tabs
            (staff.name.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
             staff.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             staff.department?.toLowerCase().includes(searchTerm.toLowerCase()))
        ) || [];
        
        if (filteredStaff.length > 0) {
          filtered[room] = filteredStaff;
        }
      });
      
      return filtered;
    }
  };

  // ⭐ Room list based on selected TAB
  const visibleRooms =
    activeTab === "ALL"
      ? filteredRooms
      : activeTab === "LEFT"
      ? filteredRooms
      : filteredRooms.filter((room) => room.startsWith(activeTab));

  const filteredStaffByRoom = getFilteredStaffByRoom();

  // ⭐ EXCEL EXPORT BASED ON TAB
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const ws_data: any[] = [];

    const tabTitle = activeTab === "LEFT" ? "LEFT STAFF" : "ACTIVE STAFF";
    const searchInfo = roomSearchTerm ? ` (Filtered by Room: ${roomSearchTerm})` : "";
    ws_data.push([`${tabTitle} - ${new Date().toISOString().slice(0, 10)}${searchInfo}`]);
    ws_data.push([]);

    const roomsToExport = activeTab === "ALL" ? filteredRooms : visibleRooms;

    roomsToExport.forEach((room) => {
      const filteredStaff = activeTab === "LEFT" 
        ? staffByRoom[room]?.filter(staff => staff.leaveDate)
        : staffByRoom[room]?.filter(staff => !staff.leaveDate);

      if (!filteredStaff || filteredStaff.length === 0) return;
      
      ws_data.push([`STAFF ROOM NO: ${room}`]);
      ws_data.push(["SL", "STAFF NAME", "DESIGNATION", "DEPARTMENT", "PHONE", "EMAIL", "JOIN DATE", "STATUS"]);

      filteredStaff.forEach((staff, index) => {
        ws_data.push([
          index + 1,
          staff.name,
          staff.designation,
          staff.department || "N/A",
          staff.phone || "N/A",
          staff.email || "N/A",
          staff.dateJoined || "N/A",
          staff.leaveDate ? `Left (${staff.leaveDate})` : "Active"
        ]);
      });

      ws_data.push([]);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

    XLSX.utils.book_append_sheet(workbook, ws, activeTab === "LEFT" ? "Left Staff" : "Active Staff");
    XLSX.writeFile(
      workbook,
      `Staff_${activeTab}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const formattedDate = new Date().toISOString().slice(0, 10);

  // Calculate totals
  const totalStaff = Object.values(staffByRoom).flat().length;
  const activeStaff = Object.values(staffByRoom).flat().filter(s => !s.leaveDate).length;
  const leftStaff = Object.values(staffByRoom).flat().filter(s => s.leaveDate).length;

  return (
    <div className="mx-2 mt-2 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 border-l-4 border-gray-500 p-4 text-lg font-semibold">
        <span>📅 Date: {formattedDate}</span>
        <span>👥 Staff: {activeStaff} Active / {totalStaff} Total</span>

        <div className="flex gap-2">
          <CommonLink
            varient="primary"
            href="/staff/create"
            title= 'Add Staff'
               
        
          />
          <button
            className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
            onClick={exportToExcel}
          >
            <Download className="mr-1" size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* ⭐ TAB BUTTONS */}
      <div className="flex gap-4 w-auto border-b pb-2">
        {["ALL", "B", "LEFT"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "ALL" | "B" | "LEFT")}
            className={`px-4 py-2 rounded-full font-semibold ${
              activeTab === tab 
                ? tab === "LEFT" 
                  ? "bg-red-600 text-white" 
                  : "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {tab} {tab === "LEFT" && "STAFF"}
          </button>
        ))}
        
        {/* Search Inputs */}
        <div className="flex gap-4 ml-auto">
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">Search by Name, Designation or Department</label>
            <input
              type="text"
              placeholder="Search staff..."
              className="border px-3 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col">
            <label className="block text-sm font-medium mb-1">Search by Room</label>
            <input
              type="text"
              placeholder="Search room (e.g., B-1, B-10)..."
              className="border px-3 py-2 rounded-full w-48 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={roomSearchTerm}
              onChange={(e) => setRoomSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ⭐ ROOM FILTER INFO */}
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
            Found {Object.keys(filteredStaffByRoom).length} rooms with {Object.values(filteredStaffByRoom).flat().length} staff members
          </div>
        </div>
      )}

      <div className="overflow-auto max-h-[590px]">
        {/* ⭐ ROOM TABLES */}
        {Object.keys(filteredStaffByRoom).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {activeTab === "LEFT" 
              ? "No left staff found" 
              : roomSearchTerm 
              ? `No rooms found containing "${roomSearchTerm}"`
              : "No staff found for the selected criteria"}
          </div>
        ) : (
          Object.keys(filteredStaffByRoom).map((room) => {
            const filteredStaff = filteredStaffByRoom[room];

            return (
              <div key={room} className="border rounded-lg flex-1 shadow-md bg-white mb-4">
                {/* ⭐ ROOM HEADER */}
                <div className={`border-b px-4 py-2 text-sm font-bold ${
                  activeTab === "LEFT" ? "bg-red-200" : "bg-gray-200"
                }`}>
                  <div className="flex justify-between items-center">
                    <span>
                      STAFF ROOM NO: {room}
                      {activeTab === "LEFT" && (
                        <span className="ml-2 text-red-600 text-xs">(Left Staff)</span>
                      )}
                    </span>
                    <div className="text-xs text-gray-600">
                      {filteredStaff.length} staff member(s)
                    </div>
                  </div>
                </div>

                <div className={`flex items-center border-b px-2 py-1 ${
                  activeTab === "LEFT" ? "bg-red-500 text-white" : "bg-primary text-white"
                }`}>
                  <User className="mr-2" size={16} />
                  <span className="font-semibold text-sm">
                    {activeTab === "LEFT" ? "Left Staff List" : "Staff Room List"}
                  </span>
                  <div className="ml-auto">
                    {activeTab !== "LEFT" && (
                      <CommonLink
                        varient="primary"
                        href={`/staff/create?roomNumber=${room}`}
                        title="Add Staff"
                      />
                    )}
                  </div>
                </div>

                <div className="p-2">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className={`text-black font-semibold ${
                        activeTab === "LEFT" ? "bg-red-100" : "bg-orange-200"
                      }`}>
                        <th className="border px-2 py-1 w-10">SL</th>
                        <th className="text-start border px-2 py-1">STAFF NAME</th>
                        <th className="text-start border px-2 py-1">DESIGNATION</th>
                        <th className="text-start border px-2 py-1">DEPARTMENT</th>
                        <th className="text-start border px-2 py-1">PHONE</th>
                        <th className="text-start border px-2 py-1">EMAIL</th>
                        {activeTab === "LEFT" && (
                          <th className="text-start border px-2 py-1">LEFT DATE</th>
                        )}
                        <th className="text-start border px-2 py-1">ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStaff.map((staff, index) => (
                        <tr key={staff.id} className="hover:bg-gray-50">
                          <td className="border px-2 py-1 text-center">{index + 1}</td>
                          <td className="border px-2 py-1 font-medium">{staff.name}</td>
                          <td className="border px-2 py-1">{staff.designation?.toUpperCase()}</td>
                          <td className="border px-2 py-1">{staff.department || "N/A"}</td>
                          <td className="border px-2 py-1">{staff.phone || "N/A"}</td>
                          <td className="border px-2 py-1 text-blue-600">{staff.email || "N/A"}</td>
                          {activeTab === "LEFT" && (
                            <td className="border px-2 py-1 text-red-600 font-semibold">
                              {staff?.leaveDate?.split('T')[0]}
                            </td>
                          )}
                          <td className="border px-1 py-1 text-center flex justify-end gap-2">
                            {activeTab === "LEFT" ? (
                              <>
                                <CommonLink
                                  varient="primary"
                                  href={`/staff/${staff.id}`}
                                  title='edit'
                                />
                                <button
                                  className="bg-green-500 text-white px-2 py-[1px] rounded-full hover:bg-green-600 text-xs"
                                  onClick={() => reactivateStaff(staff.id, room)}
                                >
                                  Reactivate
                                </button>
                                <button
                                  className="bg-red-500 text-white px-2 py-[1px] rounded-full hover:bg-red-600"
                                  onClick={() => deleteStaff(staff.id, room)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <CommonLink
                                  varient="primary"
                                  href={`/staff/${staff.id}`}
                                  title='edit'
                                />
                                <button
                                  className="bg-orange-500 text-white px-2 py-[1px] rounded-full hover:bg-orange-600 text-xs"
                                  onClick={() => markAsLeft(staff.id, room)}
                                >
                                  Mark as Left
                                </button>
                                <button
                                  className="bg-red-500 text-white px-2 py-[1px] rounded-full hover:bg-red-600"
                                  onClick={() => deleteStaff(staff.id, room)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
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