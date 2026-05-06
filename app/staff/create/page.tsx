"use client";

import { useState, useEffect } from "react";
import { UserIcon } from "lucide-react";
import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import Dropdown from "@/app/component/Dropdown";
import CommonCard from "@/app/component/CommonCard";
import CommonFormCard from "@/app/component/CommonFormCard";
import CommonLink from "@/app/component/CommonLink";
import { useParams, useRouter } from "next/navigation";

interface Staff {
  id: string;
  name: string;
  roomNumber: string;
  designation: string;
  phone: string;
  email: string;
  department: string;
  dateJoined: string;
  leaveDate: string;
}

export default function StaffForm() {
  const [formData, setFormData] = useState<Staff>({
    id: "",
    name: "",
    roomNumber: "",
    designation: "",
    phone: "",
    email: "",
    department: "",
    dateJoined: "",
    leaveDate: "",
  });

  const [rooms, setRooms] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const params = useParams();
  const router = useRouter();
  const staffId = params.staffId as string;

  // Common departments for dropdown
  const departments = [
    { id: "Engineering", label: "Engineering" },
    { id: "Quality Control", label: "Quality Control" },
    { id: "Survey", label: "Survey" },
    { id: "Health & Safety", label: "Health & Safety" },
    { id: "Management", label: "Management" },
    { id: "Administration", label: "Administration" },
    { id: "Planning", label: "Planning" },
    { id: "Scaffolding", label: "Scaffolding" },
    { id: "Works Progress", label: "Works Progress" },
    { id: "Laboratory", label: "Laboratory" },
    { id: "Other", label: "Other" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Check if we're editing an existing staff
        if (staffId && staffId !== "create") {
          setIsEditing(true);
          const staffRes = await fetch(`http://localhost:5000/staff/${staffId}`);
          if (staffRes.ok) {
            const staffData = await staffRes.json();
            setFormData({
              ...staffData.staff,
              dateJoined: staffData.staff.dateJoined?.split('T')[0] || "",
              leaveDate: staffData.staff.leaveDate?.split('T')[0] || ""
            });
          } else {
            alert("❌ Error fetching staff data");
          }
        }

        // Fetch available staff rooms for dropdown
        const commonStaffRooms = [
          "B-1", "B-2", "B-3", "B-4", "B-5", "B-6", "B-7", "B-8", "B-9", "B-10",
          "B-11", "B-12", "B-13", "B-14", "B-15", "B-16", "B-17", "B-18", "B-19", "B-20"
        ].map(room => ({
          id: room,
          label: room
        }));

        setRooms(commonStaffRooms);
      } catch (err: any) {
        console.error("Error fetching data:", err.message);
        alert("❌ Network error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [staffId]);

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("❌ Please enter staff name!");
      return;
    }

    if (!formData.roomNumber.trim()) {
      alert("❌ Please select or enter a room number!");
      return;
    }

    if (!formData.designation.trim()) {
      alert("❌ Please enter designation!");
      return;
    }

    setLoading(true);
    
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing 
      ? `http://localhost:5000/staff/${staffId}`
      : "http://localhost:5000/staff";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(isEditing ? "✅ Staff updated successfully!" : "✅ Staff created successfully!");
        
        if (!isEditing) {
          // Reset form only for new staff
          setFormData({
            id: "",
            name: "",
            roomNumber: "",
            designation: "",
            phone: "",
            email: "",
            department: "",
            dateJoined: "",
            leaveDate: "",
          });
        } else {
          // Redirect back to staff list after successful edit
          router.push("/staff");
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
    return <div className="p-4">Loading staff data...</div>;
  }

  return (
    <CommonCard
      icon={<UserIcon />}
      button={
        <div className="flex gap-2">
          <Button 
            varient="primary" 
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : (isEditing ? "Update Staff" : "Create Staff")}
          </Button>
          <CommonLink varient="danger" href="/staff" title="Cancel" />
        </div>
      }
      title={isEditing ? "Edit Staff Member" : "Create New Staff Member"}
    >
      <CommonFormCard title="Staff Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name *"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter full name"
            required
          />

          <Input
            label="Designation *"
            type="text"
            value={formData.designation}
            onChange={(e) => handleChange("designation", e.target.value)}
            placeholder="e.g., CHEIF SURVEYOR, QC ENGINEER"
            required
          />

          <div className="md:col-span-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Room Number *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={formData.roomNumber}
                  onChange={(e) => handleChange("roomNumber", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Room</option>
                  {rooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.label}
                    </option>
                  ))}
                </select>
                <Input
                  type="text"
                  value={formData.roomNumber}
                  onChange={(e) => handleChange("roomNumber", e.target.value)}
                  placeholder="Or enter room number"
                />
              </div>
              <p className="text-xs text-gray-500">
                Note: You can either select from common staff rooms or enter a room number manually
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email address"
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
        </div>

        
      </CommonFormCard>
    </CommonCard>
  );
}