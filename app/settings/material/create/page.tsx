"use client";

import { UserPlusIcon } from "lucide-react";
import { useState } from "react";

import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import CommonCard from "@/app/component/CommonCard";
import CommonLink from "@/app/component/CommonLink";
import Dropdown from "@/app/component/Dropdown";
import CheckBox from "@/app/component/CheckBox";
import CommonFormCard from "@/app/component/CommonFormCard";

export default function MaterialCreation() {
  const [languages, ] = useState<string[]>([]);
  const [specialties, ] = useState<string[]>([]);
  const [workingDays, ] = useState<string[]>([]);


    // Dropdown options as { label, value }
  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];

  const materialTypeOptions = [
    { label: "Physician", value: "physician" },
    { label: "Nurse", value: "nurse" },
    { label: "Technician", value: "technician" },
    { label: "Therapist", value: "therapist" },
    { label: "Other", value: "other" },
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Suspended", value: "suspended" },
  ];

  return (
    <CommonCard
      icon={<UserPlusIcon />}
      button={
        <div className="flex gap-2">
          <Button
            varient="primary"
            onClick={() => alert("Material Created!")}
          >
            Save
          </Button>
          <CommonLink
            varient="danger"
            href="/settings/material"
            title="Cancel"
          />
        </div>
      }
      title="Create New Material"
    >
      {/* Personal Information */}
      <CommonFormCard cols={3} title="Personal Information">
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Input label="First Name" type="text" />
            <Input label="Last Name" type="text" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input label="Prefix/Title" type="text" />
            <Input label="Suffix" type="text" />
          </div>
          <Input label="Date of Birth" type="date" />
          <Dropdown label="Gender" options={genderOptions}/>
             
          
          <Input label="National Material Identifier (NPI)" type="text" />
          <Input label="License Number" type="text" />
        </div>
      </CommonFormCard>

      {/* Professional Information */}
      <CommonFormCard title="Professional Information">
        <div className="grid gap-2" >
          <Dropdown label="Material Type" options={materialTypeOptions}/>
            
          <CheckBox
            label="Specialties"
            values={["Cardiology", "Dermatology", "Pediatrics", "Radiology", "Orthopedics"]}
            checked={specialties}
            onClick={()=>{}}
          />
          <Input label="Department" type="text" />
          <Dropdown label="Status" options={statusOptions}/>
            
        </div>
      </CommonFormCard>

      {/* Contact Information */}
      <CommonFormCard title="Contact Information">
        <div className="grid gap-2">
          <Input label="Phone Number" type="text" />
          <Input label="Email" type="email" />
          <Input label="Address Line 1" type="text" />
          <Input label="Address Line 2" type="text" />
          <div className="grid grid-cols-2 gap-2">
            <Input label="City" type="text" />
            <Input label="State" type="text" />
          </div>
          <Input label="Zip Code" type="text" />
          <Input label="Country" type="text" />
        </div>
      </CommonFormCard>

      {/* Work Information */}
      <CommonFormCard title="Work Information">
        <div className="grid gap-2">
          <Input label="Affiliated Inventory/Hospital" type="text" />
          <div className="grid grid-cols-2 gap-2">
            <Input label="Start Time" type="time" />
            <Input label="End Time" type="time" />
          </div>
          <CheckBox
            label="Working Days"
            values={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
            checked={workingDays}
            onClick={()=>{}}
          />
        </div>
      </CommonFormCard>

      {/* Languages Spoken */}
      <CommonFormCard title="Languages">
        <CheckBox
          label="Languages Spoken"
          values={["English", "Arabic", "Urdu", "Hindi", "French"]}
          checked={languages}
onClick={()=>{}}        />
      </CommonFormCard>

      {/* Insurance Information */}
      <CommonFormCard title="Insurance Information">
        <div className="grid gap-2">
          <Input label="Insurance Material" type="text" />
          <Input label="Insurance Policy Number" type="text" />
          <Input label="Insurance Group Number" type="text" />
          <Input label="Insurance Phone" type="text" />
        </div>
      </CommonFormCard>

      {/* Additional Information */}
      <CommonFormCard title="Additional Information">
        <div className="grid gap-2">
          <Input label="Notes / Comments" type="text" />
        </div>
      </CommonFormCard>
    </CommonCard>
  );
}
