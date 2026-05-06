"use client";

import { NewspaperIcon } from "lucide-react";
import { useState } from "react";

import Button from "@/app/component/Button";
import Input from "@/app/component/Input";
import CommonCard from "@/app/component/CommonCard";
import CommonLink from "@/app/component/CommonLink";
import Dropdown from "@/app/component/Dropdown";
import CheckBox from "@/app/component/CheckBox";
import CommonFormCard from "@/app/component/CommonFormCard";

const inventoryTypeOptions = [
  { id: "clinic", label: "Clinic" },
  { id: "hospital", label: "Hospital" },
  { id: "laboratory", label: "Laboratory" },
  { id: "pharmacy", label: "Pharmacy" },
];

const workingDaysOptions = [
  { id: "mon-fri", label: "Mon - Fri" },
  { id: "mon-sat", label: "Mon - Sat" },
  { id: "custom", label: "Custom" },
];

const paymentMethodOptions = [
  { id: "cash", label: "Cash" },
  { id: "credit-card", label: "Credit Card" },
  { id: "check", label: "Check" },
  { id: "insurance", label: "Insurance" },
];

const servicesOptions = [
  "General Medicine",
  "Pediatrics",
  "Dentistry",
  "Radiology",
  "Pharmacy",
  "Laboratory",
];

export default function InventoryCreation() {
  const [formData, setFormData] = useState({
    inventoryName: "",
    inventoryId: "",
    licenseNumber: "",
    prefix: "",
    suffix: "",
    inventoryType: "",
    interpreterRequired: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
    fax: "",
    email: "",
    website: "",
    servicesOffered: [] as string[],
    openingTime: "",
    closingTime: "",
    workingDays: "",
    insuranceMaterial: "",
    insurancePolicyNumber: "",
    insuranceGroupNumber: "",
    insurancePhone: "",
    insuranceAddress: "",
    adminName: "",
    adminPhone: "",
    adminEmail: "",
    adminRole: "",
    notes: "",
    paymentMethod: "",
  });

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Inventory Created!");
  };

  return (
    <CommonCard
      icon={<NewspaperIcon />}
      button={
        <div className="flex gap-2">
          <Button varient="primary" onClick={handleSubmit}>
            Save
          </Button>
          <CommonLink varient="danger" href="/settings/inventory" title="Cancel" />
        </div>
      }
      title="Create New Inventory"
    >
      {/* Inventory Information */}
      <CommonFormCard title="Inventory Information">
        <Input
          label="Inventory Name"
          type="text"
          value={formData.inventoryName}
          onChange={(e) => handleChange("inventoryName", e.target.value)}
        />
        <Input
          label="Inventory ID"
          type="text"
          value={formData.inventoryId}
          onChange={(e) => handleChange("inventoryId", e.target.value)}
        />
        <Input
          label="License Number"
          type="text"
          value={formData.licenseNumber}
          onChange={(e) => handleChange("licenseNumber", e.target.value)}
        />
        <Input
          label="Prefix/Title"
          type="text"
          value={formData.prefix}
          onChange={(e) => handleChange("prefix", e.target.value)}
        />
        <Input
          label="Suffix"
          type="text"
          value={formData.suffix}
          onChange={(e) => handleChange("suffix", e.target.value)}
        />

        <Dropdown
          label="Inventory Type"
          options={inventoryTypeOptions}
          value={formData.inventoryType}
          onChange={(val) => handleChange("inventoryType", val)}
        />

        <CheckBox
          label="Interpreter Required"
          values={["Yes", "No"]}
          checked={formData.interpreterRequired}
          onClick={(val) => handleChange("interpreterRequired", val)}
        />
      </CommonFormCard>

      {/* Address & Contact Information */}
      <CommonFormCard title="Inventory Address & Contact">
        <Input
          label="Address Line 1"
          type="text"
          value={formData.address1}
          onChange={(e) => handleChange("address1", e.target.value)}
        />
        <Input
          label="Address Line 2"
          type="text"
          value={formData.address2}
          onChange={(e) => handleChange("address2", e.target.value)}
        />
        <Input
          label="City"
          type="text"
          value={formData.city}
          onChange={(e) => handleChange("city", e.target.value)}
        />
        <Input
          label="State"
          type="text"
          value={formData.state}
          onChange={(e) => handleChange("state", e.target.value)}
        />
        <Input
          label="Zip Code"
          type="text"
          value={formData.zip}
          onChange={(e) => handleChange("zip", e.target.value)}
        />
        <Input
          label="Country"
          type="text"
          value={formData.country}
          onChange={(e) => handleChange("country", e.target.value)}
        />
        <Input
          label="Phone Number"
          type="text"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        <Input
          label="Fax"
          type="text"
          value={formData.fax}
          onChange={(e) => handleChange("fax", e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
        <Input
          label="Website"
          type="text"
          value={formData.website}
          onChange={(e) => handleChange("website", e.target.value)}
        />
      </CommonFormCard>

      {/* Services & Departments */}
      <CommonFormCard title="Services & Departments" className="md:grid-cols-1">
        <CheckBox
          label="Inventory Services"
          values={servicesOptions}
          checked={formData.servicesOffered}
          onClick={(val) => handleChange("servicesOffered", val)}
        />
      </CommonFormCard>

      {/* Operating Hours */}
      <CommonFormCard title="Operating Hours">
        <Input
          label="Opening Time"
          type="time"
          value={formData.openingTime}
          onChange={(e) => handleChange("openingTime", e.target.value)}
        />
        <Input
          label="Closing Time"
          type="time"
          value={formData.closingTime}
          onChange={(e) => handleChange("closingTime", e.target.value)}
        />

        <Dropdown
          label="Working Days"
          options={workingDaysOptions}
          value={formData.workingDays}
          onChange={(val) => handleChange("workingDays", val)}
        />
      </CommonFormCard>

      {/* Insurance Information */}
      <CommonFormCard title="Insurance Information">
        <Input
          label="Insurance Material"
          type="text"
          value={formData.insuranceMaterial}
          onChange={(e) => handleChange("insuranceMaterial", e.target.value)}
        />
        <Input
          label="Insurance Policy Number"
          type="text"
          value={formData.insurancePolicyNumber}
          onChange={(e) => handleChange("insurancePolicyNumber", e.target.value)}
        />
        <Input
          label="Insurance Group Number"
          type="text"
          value={formData.insuranceGroupNumber}
          onChange={(e) => handleChange("insuranceGroupNumber", e.target.value)}
        />
        <Input
          label="Insurance Phone"
          type="text"
          value={formData.insurancePhone}
          onChange={(e) => handleChange("insurancePhone", e.target.value)}
        />
        <Input
          label="Insurance Address"
          type="text"
          value={formData.insuranceAddress}
          onChange={(e) => handleChange("insuranceAddress", e.target.value)}
        />
      </CommonFormCard>

      {/* Administrator / Contact Person */}
      <CommonFormCard title="Administrator / Contact Person">
        <Input
          label="Name"
          type="text"
          value={formData.adminName}
          onChange={(e) => handleChange("adminName", e.target.value)}
        />
        <Input
          label="Phone"
          type="text"
          value={formData.adminPhone}
          onChange={(e) => handleChange("adminPhone", e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={formData.adminEmail}
          onChange={(e) => handleChange("adminEmail", e.target.value)}
        />
        <Input
          label="Role/Position"
          type="text"
          value={formData.adminRole}
          onChange={(e) => handleChange("adminRole", e.target.value)}
        />
      </CommonFormCard>

      {/* Additional Information */}
      <CommonFormCard title="Additional Information">
        <Input
          label="Notes / Comments"
          type="text"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
        />

        <Dropdown
          label="Payment Method"
          options={paymentMethodOptions}
          value={formData.paymentMethod}
          onChange={(val) => handleChange("paymentMethod", val)}
        />
      </CommonFormCard>
    </CommonCard>
  );
}
