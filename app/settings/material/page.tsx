"use client";

import { useState } from "react";
import CommonCard from "../../component/CommonCard";
import { SearchCheck } from "lucide-react";
import CommonLink from "@/app/component/CommonLink";
import Button from "@/app/component/Button";
 import { ColumnDef } from "@tanstack/react-table";
import CommonDataGrid from "@/app/component/DataGrid";
 

// Define material type
interface Material {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  city: string;
  status: string;
}

// Define columns
const columns: ColumnDef<Material>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "specialty", header: "Specialty" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "status", header: "Status" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button varient="primary" onClick={() => alert(`Edit ${row.original.name}`)}>
          Edit
        </Button>
        <Button varient="danger" onClick={() => alert(`Delete ${row.original.name}`)}>
          Delete
        </Button>
      </div>
    ),
  },
];

// Dummy material data
const dummyMaterials: Material[] = [
  { id: 1, name: "Dr. Ayesha Malik", specialty: "Cardiologist", phone: "055-123-4567", email: "ayesha.malik@clinic.com", city: "Riyadh", status: "Active" },
  { id: 2, name: "Dr. Fahad Khan", specialty: "Dermatologist", phone: "056-234-5678", email: "fahad.khan@hospital.com", city: "Jeddah", status: "Inactive" },
  { id: 3, name: "Dr. Mariam Ali", specialty: "Pediatrician", phone: "057-345-6789", email: "mariam.ali@healthcare.com", city: "Dammam", status: "Active" },
  { id: 4, name: "Dr. Omar Hassan", specialty: "Orthopedic", phone: "058-456-7890", email: "omar.hassan@hospital.com", city: "Makkah", status: "Active" },
];

export default function MaterialGridPage() {
  const [data] = useState<Material[]>(dummyMaterials);

  return (
    <CommonCard
      icon={<SearchCheck />}
      button={
        <CommonLink
          varient="primary"
          href="/settings/material/create"
          title="Create Material"
        />
      }
      title="Search Material"
    >
      <div className="">
         <CommonDataGrid columns={columns} data={data} />
      </div>
    </CommonCard>
  );
}
