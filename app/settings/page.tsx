"use client";

import CommonCard from "../component/CommonCard";
import {
  Users,
  Building2,
  BriefcaseMedical,
  Settings as SettingsIcon,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import CommonTab from "../component/CommanTabs";

const size = 40;

const links = [
  { href: "/settings/workers", label: "Workers", icon: <Users size={size} /> },
  { href: "/settings/material", label: "Materials", icon: <UserCog size={size} /> },
  { href: "/settings/inventory", label: "Inventorys", icon: <Building2 size={size} /> },
  { href: "/settings/insurance", label: "Insurance", icon: <ShieldCheck size={size} /> },
  { href: "/settings/services", label: "Services", icon: <BriefcaseMedical size={size} /> },
];

export default function Index() {
  return (
    <CommonCard icon={<SettingsIcon />} title="Settings">
      <div className="p-2">
        <CommonTab dataList={links} />
      </div>
    </CommonCard>
  );
}
