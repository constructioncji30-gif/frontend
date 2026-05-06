"use client";

import { useState, useEffect } from "react";
import { NewspaperIcon } from "lucide-react";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import CommonLink from "@/app/component/CommonLink";

interface Room {
  roomNumber: string;
  availableSeats: number;
}

interface Worker {
  id: string;
  name: string;
  iqamaNumber: string;
  supplier: string;
  position: string;
  phone: string;
  dateJoined: string;
  leaveDate: string;
  roomNumber: string;
}

export default function Index({ workerId }: { workerId: string }) {
  const [formData, setFormData] = useState<Worker>({
    id: "",
    name: "",
    iqamaNumber: "",
    supplier: "",
    position: "",
    phone: "",
    dateJoined: "",
    leaveDate: "",
    roomNumber: "", // final room number (from dropdown or manual)
  });

  const [rooms, setRooms] = useState<{ id: string; label: string }[]>([]);

  // Fetch worker data to pre-fill the form if editing
  useEffect(() => {
    if (workerId) {
      const fetchWorker = async () => {
        try {
          const res = await fetch(`http://localhost:5000/workers/${workerId}`);
          const data = await res.json();
          
          if (res.ok) {
            setFormData(data.worker); // Assuming the worker object structure matches
          } else {
            alert("❌ Error: " + data.error);
          }
        } catch (err: any) {
          console.error("Error fetching worker data:", err.message);
        }
      };

      fetchWorker();
    }

    // Fetch available rooms for dropdown
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:5000/rooms/available-seats");
        const data = await res.json();

        if (res.ok) {
          const dropdownOptions = data.rooms
            .filter((r: Room) => r.availableSeats > 0)
            .map((r: Room) => ({
              id: r.roomNumber,
              label: `${r.roomNumber} (${r.availableSeats} seats)`,
            }));

          setRooms(dropdownOptions);
        }
      } catch (err: any) {
        console.error("Network error:", err.message);
      }
    };

    fetchRooms();
  }, [workerId]);

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.roomNumber) {
      alert("❌ Please select or enter a room number!");
      return;
    }

    const method = workerId ? "PUT" : "POST"; // Use PUT if editing, POST if creating a new worker
    const url = workerId ? `http://localhost:5000/workers/${workerId}` : "http://localhost:5000/workers"; // Update URL if editing

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(workerId ? "✅ Worker updated successfully!" : "✅ Worker created successfully!");
        // Reset form or redirect
        setFormData({
          id: "",
          name: "",
          iqamaNumber: "",
          supplier: "",
          position: "",
          phone: "",
          dateJoined: "",
          leaveDate: "",
          roomNumber: "",
        });
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err: any) {
      alert("❌ Network Error: " + err.message);
    }
  };

  return (
    <CommonCard
      icon={<NewspaperIcon />}
      button={
        <div>
          <Button varient="primary" onClick={handleSave}>
            Save
          </Button>
          <CommonLink varient="danger" href="/settings/workers" title="Cancel" />
        </div>
      }
      title={workerId ? "Edit Worker" : "Create New Worker"}
    >
      <CommonFormCard title="Worker Information">
        <Input
          label="Name"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <Input
          label="Iqama Number"
          type="text"
          value={formData.iqamaNumber}
          onChange={(e) => handleChange("iqamaNumber", e.target.value)}
        />

        <Input
          label="Supplier"
          type="text"
          value={formData.supplier}
          onChange={(e) => handleChange("supplier", e.target.value)}
        />

        <Input
          label="Position"
          type="text"
          value={formData.position}
          onChange={(e) => handleChange("position", e.target.value)}
        />

        <Input
          label="Phone"
          type="text"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <Input
          label="Date Joined"
          type="date"
          value={formData.dateJoined}
          onChange={(e) => handleChange("dateJoined", e.target.value)}
        />

        <Input
          label="Leave Date"
          type="date"
          value={formData.leaveDate}
          onChange={(e) => handleChange("leaveDate", e.target.value)}
        />

        {/* Room dropdown */}
        <Dropdown
          label="Select Room (optional)"
          options={rooms}
          value={formData.roomNumber}
          onChange={(e) => handleChange("roomNumber", e.target.value)}
        />

        {/* Option to manually enter a new room number */}
        <Input
          label="Enter New Room Number"
          type="text"
          placeholder="E.g. C-10"
          value={formData.roomNumber}
          onChange={(e) => handleChange("roomNumber", e.target.value)}
        />
      </CommonFormCard>
    </CommonCard>
  );
}
