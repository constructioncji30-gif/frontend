"use client";

import { useState, useEffect } from "react";
import { NewspaperIcon } from "lucide-react";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import CommonLink from "@/app/component/CommonLink";
import { useParams, useRouter } from "next/navigation";

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
  MEDICAL:string;
}

export default function WorkerForm() {
  const [formData, setFormData] = useState<Worker>({
    id: "",
    name: "",
    iqamaNumber: "",
    supplier: "",
    position: "",
    phone: "",
    dateJoined: "",
    leaveDate: "",
    roomNumber: "",
    MEDICAL:'NO'
  });

  const [rooms, setRooms] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const params = useParams();
  const router = useRouter();
  const workerId = params.workerId as string;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Check if we're editing an existing worker
        if (workerId && workerId !== "create") {
          setIsEditing(true);
          const workerRes = await fetch(`https://camp-kohl.vercel.app/workers/${workerId}`);
          if (workerRes.ok) {
            const workerData = await workerRes.json();
            setFormData(workerData.worker);
          } else {
            alert("❌ Error fetching worker data");
          }
        }

        // Fetch available rooms for dropdown
        const roomsRes = await fetch("https://camp-kohl.vercel.app/rooms/available-seats");
        if (roomsRes.ok) {
          const roomsData = await roomsRes.json();
          const dropdownOptions = roomsData.rooms
            .filter((r: Room) => r.availableSeats > 0)
            .map((r: Room) => ({
              id: r.roomNumber,
              label: `${r.roomNumber} (${r.availableSeats} seats)`,
            }));

          setRooms(dropdownOptions);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err.message);
        alert("❌ Network error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [workerId]);

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("❌ Please enter worker name!");
      return;
    }

    if (!formData.roomNumber.trim()) {
      alert("❌ Please select or enter a room number!");
      return;
    }

    setLoading(true);
    
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing 
      ? `https://camp-kohl.vercel.app/workers/${workerId}`
      : "https://camp-kohl.vercel.app/workers";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(isEditing ? "✅ Worker updated successfully!" : "✅ Worker created successfully!");
        
        if (!isEditing) {
          // Reset form only for new workers
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
            MEDICAL:'NO'
          });
        } else {
          // Redirect back to workers list after successful edit
          router.push("/workers");
        }
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err: any) {
      alert("❌ Network Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="p-4">Loading worker data...</div>;
  }

  return (
    <CommonCard
      icon={<NewspaperIcon />}
      button={
        <div className="flex gap-2">
          <Button 
            varient="primary" 
            // onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
          <CommonLink varient="danger" href="/workers" title="Cancel" />
        </div>
      }
      title={isEditing ? "Edit Worker" : "Create New Worker"}
    >
      <CommonFormCard title="Worker Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name *"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter worker name"
            required
          />

          <Input
            label="Iqama Number"
            type="text"
            value={formData.iqamaNumber}
            onChange={(e) => handleChange("iqamaNumber", e.target.value)}
            placeholder="Enter Iqama number"
          />

          <Input
            label="Supplier"
            type="text"
            value={formData.supplier}
            onChange={(e) => handleChange("supplier", e.target.value)}
            placeholder="Enter supplier name"
          />

          <Input
            label="Position"
            type="text"
            value={formData.position}
            onChange={(e) => handleChange("position", e.target.value)}
            placeholder="Enter position"
          />

          <Input
            label="Phone"
            type="text"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
          />

          <Input
            label="Date Joined"
            type="date"
            value={formData.dateJoined?.split('T')[0]}
            onChange={(e) => handleChange("dateJoined", e.target.value)}
          />

          <Input
            label="Leave Date"
            type="date"
            value={formData.leaveDate?.split('T')[0]}
            onChange={(e) => handleChange("leaveDate", e.target.value)}
          />

          <div className="md:col-span-2">
            <Dropdown
              label="Select Room *"
              options={rooms}
              value={formData.roomNumber}
              onChange={(e) => handleChange("roomNumber", e.target.value)}
        
            />
          </div>

          <div className="md:col-span-2">
            <Input
              label="Or Enter Room Number Manually *"
              type="text"
              placeholder="E.g. C-10"
              value={formData.roomNumber}
              onChange={(e) => handleChange("roomNumber", e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Note: You can either select from available rooms or enter a room number manually
            </p>
          </div>
        </div>
      </CommonFormCard>
    </CommonCard>
  );
}