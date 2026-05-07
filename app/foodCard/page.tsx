"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  CardSim, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  UserPlus,
  UserMinus,
  Download,
  Users,
  BarChart,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileSpreadsheet,
  Hash,
  User,
  Building,
  Eye,
  ChevronDown,
  X,
  Check
} from "lucide-react";
import * as XLSX from 'xlsx';

interface FoodCard {
  id: number;
  card_number: string;
  iqama_number?: string;
  status: string;
  issue_date: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
  worker_id?: number;
  name?: string;
  supplier?: string;
  position?: string;
  phone?: string;
  roomNumber?: string;
  dateJoined?: string;
  leaveDate?: string;
}

interface Worker {
  id: number;
  name: string;
  iqama_number: string;
  supplier?: string;
  position?: string;
  roomNumber?: string;
  phone?: string;
  dateJoined?: string;
}

interface Stats {
  total: number;
  assigned: number;
  available: number;
  assigned_percentage: string;
  available_percentage: string;
  first_card: string;
  last_card: string;
}

const FoodCardManagement = () => {
  const [cards, setCards] = useState<FoodCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<FoodCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"assigned" | "available">("assigned");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState<Stats>({
    total: 0,
    assigned: 0,
    available: 0,
    assigned_percentage: "0",
    available_percentage: "0",
    first_card: "",
    last_card: ""
  });

  // Worker dropdown state
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [workersLoading, setWorkersLoading] = useState(false);
  const [showWorkerDropdown, setShowWorkerDropdown] = useState<string | null>(null);
  const [workerSearch, setWorkerSearch] = useState("");
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch assigned cards
  const fetchAssignedCards = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://camp-kohl.vercel.app/food-cards/assigned?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      const data = await res.json();
      
      if (data.success) {
        const cardsData = data.cards || [];
        setCards(cardsData);
        setFilteredCards(cardsData);
        setTotalItems(data.pagination?.total || cardsData.length);
      }
    } catch (error) {
      console.error("Error fetching assigned cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available cards
  const fetchAvailableCards = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://camp-kohl.vercel.app/food-cards/available?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      const data = await res.json();
      
      if (data.success) {
        const cardsData = data.cards || [];
        setCards(cardsData);
        setFilteredCards(cardsData);
        setTotalItems(data.pagination?.total || cardsData.length);
      }
    } catch (error) {
      console.error("Error fetching available cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const res = await fetch("https://camp-kohl.vercel.app/food-cards/summary");
      const data = await res.json();
      if (data.success && data.summary) {
        setStats(data.summary);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch workers for dropdown
  const fetchWorkers = async (search = "") => {
    setWorkersLoading(true);
    try {
      const url = search 
        ? `https://camp-kohl.vercel.app/workers/for-foodcard-assignment?search=${encodeURIComponent(search)}`
        : 'https://camp-kohl.vercel.app/workers/for-foodcard-assignment';
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.success) {
        setWorkers(data.workers || []);
        setFilteredWorkers(data.workers || []);
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
    } finally {
      setWorkersLoading(false);
    }
  };

  // Fetch data based on view mode
  useEffect(() => {
    switch (viewMode) {
      case 'assigned':
        fetchAssignedCards();
        break;
      case 'available':
        fetchAvailableCards();
        break;
    }
    fetchStats();
  }, [viewMode, currentPage, itemsPerPage]);

  // Fetch workers when dropdown is shown
  useEffect(() => {
    if (showWorkerDropdown) {
      fetchWorkers();
    }
  }, [showWorkerDropdown]);

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCards(cards);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = cards.filter(card => {
      const searchableFields = [
        card.card_number?.toLowerCase(),
        card.iqama_number?.toLowerCase(),
        card.name?.toLowerCase(),
        card.supplier?.toLowerCase(),
        card.position?.toLowerCase(),
        card.roomNumber?.toLowerCase(),
        card.phone
      ].filter(Boolean);

      return searchableFields.some(field => 
        typeof field === 'string' ? field.includes(searchLower) : String(field).includes(searchLower)
      );
    });

    setFilteredCards(filtered);
    setCurrentPage(1);
  }, [searchTerm, cards]);

  // Filter workers based on search
  useEffect(() => {
    if (!workerSearch) {
      setFilteredWorkers(workers);
    } else {
      const filtered = workers.filter(worker =>
        worker.name?.toLowerCase().includes(workerSearch.toLowerCase()) ||
        worker.iqama_number?.includes(workerSearch) ||
        worker.supplier?.toLowerCase().includes(workerSearch.toLowerCase())
      );
      setFilteredWorkers(filtered);
    }
  }, [workerSearch, workers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWorkerDropdown(null);
        setWorkerSearch("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle assign card with dropdown
  const handleAssignCard = (cardNumber: string) => {
    setShowWorkerDropdown(cardNumber);
    setWorkerSearch("");
  };

  // Select worker from dropdown
  const selectWorker = async (cardNumber: string, worker: Worker) => {
    if (!confirm(`Assign card ${cardNumber} to ${worker.name} (${worker.iqama_number})?`)) {
      return;
    }

    try {
      const res = await fetch(`https://camp-kohl.vercel.app/food-cards/${cardNumber}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          iqama_number: worker.iqama_number 
        })
      });
      
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        // Close dropdown
        setShowWorkerDropdown(null);
        setWorkerSearch("");
        
        // Refresh data
        switch (viewMode) {
          case 'assigned':
            fetchAssignedCards();
            break;
          case 'available':
            fetchAvailableCards();
            break;
        }
        fetchStats();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error assigning card:", error);
      alert("Failed to assign card");
    }
  };

  // Handle unassign card
  const handleUnassignCard = async (cardNumber: string) => {
    if (!confirm("Are you sure you want to unassign this card?")) return;

    try {
      const res = await fetch(`https://camp-kohl.vercel.app/food-cards/${cardNumber}/unassign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        // Refresh data
        switch (viewMode) {
          case 'assigned':
            fetchAssignedCards();
            break;
          case 'available':
            fetchAvailableCards();
            break;
        }
        fetchStats();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error unassigning card:", error);
      alert("Failed to unassign card");
    }
  };

  // Download Excel
  const downloadSimpleExcel = async () => {
    try {
      const res = await fetch('https://camp-kohl.vercel.app/food-cards/assigned?limit=1000');
      const data = await res.json();
      
      if (data.success) {
        const assignedCards = data.cards || [];
        
        // Create header
        const header = [
          ["ASSIGNED FOOD CARDS - WORKER LIST"],
          [`Date: ${new Date().toLocaleDateString()}`],
          [""],
          ["LABOUR NAME", "SUPPLY", "ID", "DESGINATION", "CARD NUMBER"]
        ];

        // Add data rows
        const rows = assignedCards.map((card: FoodCard) => [
          card.name || "",
          card.supplier || "",
          card.iqama_number || "",
          card.position || "",
          card.card_number || ""
        ]);

        // Combine header and data
        const excelData = [...header, ...rows];

        // Create workbook
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(excelData);

        // Style header rows
        if (ws['A1']) {
          ws['A1'].s = { font: { bold: true, sz: 16 } };
        }
        if (ws['A2']) {
          ws['A2'].s = { font: { italic: true } };
        }
        
        // Merge header cells
        ws['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
          { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }
        ];

        // Style column headers
        const headerRow = 3;
        for (let col = 0; col < 5; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
          if (ws[cellAddress]) {
            ws[cellAddress].s = {
              font: { bold: true, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: "2563EB" } },
              alignment: { horizontal: "center" }
            };
          }
        }

        // Set column widths
        const colWidths = [
          { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
        ];
        ws['!cols'] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, "Assigned Cards");

        // Download
        const filename = `Assigned_Food_Cards_${new Date().toISOString().slice(0, 10)}.xlsx`;
        XLSX.writeFile(wb, filename);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data");
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { color: string; icon: React.ReactNode }> = {
      ACTIVE: { color: "bg-green-100 text-green-800", icon: <CheckCircle size={14} /> },
      INACTIVE: { color: "bg-gray-100 text-gray-800", icon: <XCircle size={14} /> },
      LOST: { color: "bg-red-100 text-red-800", icon: <AlertTriangle size={14} /> },
      DAMAGED: { color: "bg-yellow-100 text-yellow-800", icon: <AlertTriangle size={14} /> },
      EXPIRED: { color: "bg-orange-100 text-orange-800", icon: <AlertTriangle size={14} /> }
    };

    const { color, icon } = config[status] || { color: "bg-gray-100", icon: null };

    return (
      <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${color}`}>
        {icon} {status}
      </span>
    );
  };

  // Worker Dropdown Component
  const WorkerDropdown = ({ cardNumber }: { cardNumber: string }) => {
    return (
      <div 
        ref={dropdownRef}
        className="absolute z-50 mt-2 w-96 bg-white rounded-lg shadow-lg border max-h-96 overflow-hidden"
      >
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search workers by name, IQAMA, or supplier..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
              value={workerSearch}
              onChange={(e) => setWorkerSearch(e.target.value)}
              autoFocus
            />
            <button
              onClick={() => setShowWorkerDropdown(null)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1 px-1">
            Assigning card: <span className="font-bold">{cardNumber}</span>
          </div>
        </div>

        <div className="overflow-y-auto max-h-80">
          {workersLoading ? (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-600">Loading workers...</p>
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {workerSearch ? "No workers found" : "No workers available"}
            </div>
          ) : (
            <div className="divide-y">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => selectWorker(cardNumber, worker)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{worker.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-2">
                          <Hash size={12} />
                          IQAMA: <span className="font-mono">{worker.iqama_number}</span>
                        </div>
                        {worker.supplier && (
                          <div className="flex items-center gap-2 mt-1">
                            <Building size={12} />
                            Supplier: {worker.supplier}
                          </div>
                        )}
                        {worker.roomNumber && (
                          <div className="flex items-center gap-2 mt-1">
                            <span>🏠</span>
                            Room: {worker.roomNumber}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      No card assigned
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t p-2 bg-gray-50">
          <button
            onClick={() => {
              const iqama = prompt("Enter new IQAMA (if worker not in list):");
              if (iqama) {
                selectWorker(cardNumber, {
                  id: 0,
                  name: "New Worker",
                  iqama_number: iqama,
                  supplier: "Unknown"
                });
              }
            }}
            className="w-full text-sm text-blue-600 hover:text-blue-800"
          >
            + Add new IQAMA
          </button>
        </div>
      </div>
    );
  };

  // Pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const Pagination = () => (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-600">
        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} cards
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight size={18} />
        </button>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded-lg p-2 text-sm"
        >
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
          <option value="200">200 per page</option>
        </select>
      </div>
    </div>
  );

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Food Card Management System</h1>
          <p className="text-gray-600">Manage food cards based on IQAMA numbers</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadSimpleExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <FileSpreadsheet size={18} />
            Download Excel
          </button>
          <button
            onClick={() => {
              switch (viewMode) {
                case 'assigned':
                  fetchAssignedCards();
                  break;
                case 'available':
                  fetchAvailableCards();
                  break;
              }
              fetchStats();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Cards</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <CardSim className="text-blue-500" size={24} />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            ZJ001 to ZJ0138
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Assigned Cards</p>
              <p className="text-2xl font-bold text-green-600">{stats.assigned}</p>
            </div>
            <Users className="text-green-500" size={24} />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {stats.assigned_percentage}% utilization
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Cards</p>
              <p className="text-2xl font-bold text-blue-600">{stats.available}</p>
            </div>
            <CardSim className="text-blue-500" size={24} />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Ready for assignment
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Assignment Rate</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.assigned_percentage}%
              </p>
            </div>
            <BarChart className="text-orange-500" size={24} />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Cards assigned vs total
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* View Mode Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("assigned")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${viewMode === "assigned" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              <Users size={18} />
              Assigned Cards
            </button>
            <button
              onClick={() => setViewMode("available")}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${viewMode === "available" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              <CardSim size={18} />
              Available Cards
            </button>
          </div>

          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by card number, IQAMA, name, supplier..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={downloadSimpleExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading cards...</p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <CardSim className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
          <p className="text-gray-500">
            {searchTerm ? `No cards match "${searchTerm}"` : "No cards available"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative">
            {filteredCards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((card) => (
              <div key={card.id || card.card_number} className="bg-blue-500  rounded-lg shadow border overflow-hidden">
                {/* Card Header */}
                <div className={`p-4 ${card.iqama_number ? 'bg-blue-500' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg  text-white">{card.card_number}</h3>
                      <p className="text-sm text-white">
                        {card.iqama_number ? 'Assigned' : 'Available'}
                      </p>
                    </div>
                    <StatusBadge status={card.status?.toUpperCase()} />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 text-white">
                  {card.iqama_number ? (
                    <>
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-sm  mb-1">
                          <User size={14} />
                          Worker Name
                        </div>
                        <p className="font-medium">{card.name || "N/A"}</p>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-sm  mb-1">
                          <Hash size={14} />
                          IQAMA Number
                        </div>
                        <p className="font-mono">{card.iqama_number}</p>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-sm  mb-1">
                          <Building size={14} />
                          Supplier
                        </div>
                        <p>{card.supplier || "N/A"}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <div className="text-xs ">Room</div>
                          <div className="font-medium">{card.roomNumber || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-xs ">Position</div>
                          <div className="font-medium">{card.position || "N/A"}</div>
                        </div>
                      </div>

                      {/* Actions for assigned cards */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUnassignCard(card.card_number)}
                          className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 flex items-center justify-center gap-1"
                        >
                          <UserMinus size={14} />
                          Unassign
                        </button>
                      </div>
                    </>
                  ) : (
                    // Available card view with dropdown
                    <>
                      <div className="text-center py-4">
                        <div className="text-4xl mb-2">📭</div>
                        <p className="text-gray-600 mb-4">Card available for assignment</p>
                        
                        <div className="space-y-2 text-sm text-gray-500">
                          <div className="flex justify-between">
                            <span>Issue Date:</span>
                            <span>{formatDate(card.issue_date)}</span>
                          </div>
                          {card.expiry_date && (
                            <div className="flex justify-between">
                              <span>Expiry:</span>
                              <span>{formatDate(card.expiry_date)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Assign button with dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => handleAssignCard(card.card_number)}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                          <UserPlus size={16} />
                          Assign to Worker
                          <ChevronDown size={16} />
                        </button>
                        
                        {/* Dropdown positioned below the button */}
                        {showWorkerDropdown === card.card_number && (
                          <div className="absolute left-0 right-0 top-full mt-1">
                            <WorkerDropdown cardNumber={card.card_number} />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalItems > itemsPerPage && <Pagination />}
        </>
      )}
    </div>
  );
};

export default FoodCardManagement;