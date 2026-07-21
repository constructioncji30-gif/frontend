"use client";

import React, { useEffect, useState } from "react";
import PieCharts from "../chart/PieCharts";
import SearchFilter from "./SearchFilter";
import BarChart from "../chart/BarCharts";
import { FaTachometerAlt } from "react-icons/fa";
import { MdOutlineFilterAltOff, MdOutlineFilterAlt } from "react-icons/md";
import WorkerLeaderboard from "./Leaderboard";
import CommonCard from "@/app/component/CommonCard";
import Button from "@/app/component/Button";

interface Worker {
  id: number;
  name: string;
  iqamaNumber: string;
  supplier: string | null;
  position: string | null;
  phone: string;
  dateJoined: string;
  leaveDate: string | null;
  roomNumber: string | null;
}

interface DashboardCount {
  workDetail: string;
  count: number;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [dashboardCounts, setDashboardCounts] = useState<DashboardCount[]>([]);

  const [rankBy, setRankBy] = useState<"age" | "year">("age");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://camp-o33dvx9rm-constructions-projects-d5ff0c38.vercel.app/dashboard");
        const data = await res.json();

        setWorkers(data.workers);
        setDashboardCounts(data.dashboardCounts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading)
    return (
      <CommonCard title="Dashboard" icon={<FaTachometerAlt />}>
        <p className="text-center py-10 text-lg">Loading...</p>
      </CommonCard>
    );

  return (
    <CommonCard title="Dashboard" icon={<FaTachometerAlt />}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <CommonCard title="Worker Statistics Overview">
          <BarChart data={dashboardCounts} />
        </CommonCard>

        <CommonCard title="Work Detail Distribution">
          <PieCharts  />
        </CommonCard>

        {/* <CommonCard title="Worker Leaderboard">
          <div className="flex gap-2 mb-4">
            <Button
              varient={rankBy === "age" ? "primary" : "secondary"}
              onClick={() => setRankBy("age")}
            >
              Rank by Age
            </Button>
            <Button
              varient={rankBy === "year" ? "primary" : "secondary"}
              onClick={() => setRankBy("year")}
            >
              Rank by Year
            </Button>
          </div>

          <WorkerLeaderboard data={workers} rankBy={rankBy} />
        </CommonCard>

        <CommonCard
          title="Search & Filter Workers"
          icon={
            showFilters ? (
              <MdOutlineFilterAltOff
                onClick={() => setShowFilters(false)}
                className="cursor-pointer"
              />
            ) : (
              <MdOutlineFilterAlt
                onClick={() => setShowFilters(true)}
                className="cursor-pointer"
              />
            )
          }
        >
          <SearchFilter data={workers} showFilters={showFilters} />
        </CommonCard> */}

      </div>
    </CommonCard>
  );
};

export default Dashboard;
