"use client";
// Add this new file: attendance-tab.tsx
import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Coffee,
  Utensils,
  Moon,
  User,
  Hash,
  Building,
  Check,
  X,
  Eye,
  BarChart,
  FileSpreadsheet,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  Save,
  SkipBack,
  SkipForward,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import * as XLSX from 'xlsx';

interface AttendanceRecord {
  id?: number;
  worker_id: number;
  iqama_number: string;
  name: string;
  supplier: string;
  date: string;
  breakfast: 'present' | 'absent' | null;
  lunch: 'present' | 'absent' | null;
  dinner: 'present' | 'absent' | null;
  breakfast_time?: string;
  lunch_time?: string;
  dinner_time?: string;
  notes?: string;
  roomNumber?: string;
  card_number?: string;
  position?: string;
}

interface AttendanceStats {
  total: number;
  breakfast_present: number;
  lunch_present: number;
  dinner_present: number;
  breakfast_absent: number;
  lunch_absent: number;
  dinner_absent: number;
  breakfast_percentage: number;
  lunch_percentage: number;
  dinner_percentage: number;
  total_present: number;
  total_absent: number;
}

const AttendanceTab = () => {
  // State Management
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mealFilter, setMealFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent'>('all');
  const [viewMode, setViewMode] = useState<'daily' | 'summary'>('daily');
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState<Set<number>>(new Set());
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<AttendanceStats>({
    total: 0,
    breakfast_present: 0,
    lunch_present: 0,
    dinner_present: 0,
    breakfast_absent: 0,
    lunch_absent: 0,
    dinner_absent: 0,
    breakfast_percentage: 0,
    lunch_percentage: 0,
    dinner_percentage: 0,
    total_present: 0,
    total_absent: 0
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch attendance data
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://camp-kohl.vercel.app/attendance?date=${selectedDate}&page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      const data = await res.json();
      
      if (data?.success) {
        setAttendance(data?.attendance || []);
        setFilteredAttendance(data?.attendance || []);
        setTotalItems(data?.pagination?.total || data?.attendance?.length || 0);
        
        // Calculate stats
        calculateStats(data?.attendance || []);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendance([]);
      setFilteredAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  // Initialize attendance for the day
  const initializeAttendance = async () => {
    if (!confirm(`Initialize attendance for ${selectedDate}? This will create records for all active workers.`)) {
      return;
    }

    try {
      const res = await fetch('https://camp-kohl.vercel.app/attendance/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate })
      });
      
      const data = await res.json();
      if (data?.success) {
        alert(`Attendance initialized for ${data?.count} workers`);
        fetchAttendance();
      } else {
        alert(`Error: ${data?.error}`);
      }
    } catch (error) {
      console.error("Error initializing attendance:", error);
      alert("Failed to initialize attendance");
    }
  };

  // Mark attendance
  const markAttendance = async (workerId: number, meal: 'breakfast' | 'lunch' | 'dinner', status: 'present' | 'absent') => {
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    try {
      const res = await fetch(`https://camp-kohl.vercel.app/attendance/mark`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          meal,
          workerId,
          status,
          time: currentTime
        })
      });

      const data = await res.json();
      if (data?.success) {
        // Update local state
        setAttendance(prev => prev.map(record => 
          record.worker_id === workerId 
            ? { 
                ...record, 
                [meal]: status,
                [`${meal}_time`]: currentTime
              }
            : record
        ));
        
        setFilteredAttendance(prev => prev.map(record => 
          record.worker_id === workerId 
            ? { 
                ...record, 
                [meal]: status,
                [`${meal}_time`]: currentTime
              }
            : record
        ));
        
        // Recalculate stats
        calculateStats(attendance.map(record => 
          record.worker_id === workerId 
            ? { 
                ...record, 
                [meal]: status,
                [`${meal}_time`]: currentTime
              }
            : record
        ));
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance");
    }
  };

  // Bulk mark attendance
  const bulkMarkAttendance = async (meal: 'breakfast' | 'lunch' | 'dinner', status: 'present' | 'absent') => {
    if (selectedWorkers.size === 0) {
      alert("Please select workers first");
      return;
    }

    if (!confirm(`Mark ${selectedWorkers.size} selected workers as ${status} for ${meal}?`)) {
      return;
    }

    try {
      const res = await fetch('https://camp-kohl.vercel.app/attendance/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          meal,
          status,
          worker_ids: Array.from(selectedWorkers)
        })
      });

      const data = await res.json();
      if (data?.success) {
        alert(`Successfully marked ${data?.stats.success} workers`);
        setBulkSelectMode(false);
        setSelectedWorkers(new Set());
        fetchAttendance();
      } else {
        alert(`Error: ${data?.error}`);
      }
    } catch (error) {
      console.error("Error bulk marking attendance:", error);
      alert("Failed to mark attendance");
    }
  };

  // Calculate statistics
  const calculateStats = (records: AttendanceRecord[]) => {
    const total = records.length;
    const breakfast_present = records.filter(r => r.breakfast === 'present').length;
    const lunch_present = records.filter(r => r.lunch === 'present').length;
    const dinner_present = records.filter(r => r.dinner === 'present').length;
    const breakfast_absent = records.filter(r => r.breakfast === 'absent').length;
    const lunch_absent = records.filter(r => r.lunch === 'absent').length;
    const dinner_absent = records.filter(r => r.dinner === 'absent').length;
    
    const breakfast_total = breakfast_present + breakfast_absent;
    const lunch_total = lunch_present + lunch_absent;
    const dinner_total = dinner_present + dinner_absent;
    
    setStats({
      total,
      breakfast_present,
      lunch_present,
      dinner_present,
      breakfast_absent,
      lunch_absent,
      dinner_absent,
      breakfast_percentage: breakfast_total > 0 ? Math.round((breakfast_present / breakfast_total) * 100) : 0,
      lunch_percentage: lunch_total > 0 ? Math.round((lunch_present / lunch_total) * 100) : 0,
      dinner_percentage: dinner_total > 0 ? Math.round((dinner_present / dinner_total) * 100) : 0,
      total_present: breakfast_present + lunch_present + dinner_present,
      total_absent: breakfast_absent + lunch_absent + dinner_absent
    });
  };

  // Filter attendance based on search and filters
  useEffect(() => {
    let filtered = attendance;

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.name.toLowerCase().includes(term) ||
        record.iqama_number.includes(term) ||
        record.supplier.toLowerCase().includes(term) ||
        (record.card_number && record.card_number.includes(term)) ||
        (record.roomNumber && record.roomNumber.toLowerCase().includes(term))
      );
    }

    // Apply meal filter
    if (mealFilter !== 'all') {
      filtered = filtered.filter(record => record[mealFilter] !== null);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      if (mealFilter === 'all') {
        filtered = filtered.filter(record =>
          record.breakfast === statusFilter ||
          record.lunch === statusFilter ||
          record.dinner === statusFilter
        );
      } else {
        filtered = filtered.filter(record => record[mealFilter] === statusFilter);
      }
    }

    setFilteredAttendance(filtered);
    setCurrentPage(1);
  }, [searchTerm, mealFilter, statusFilter, attendance]);

  // Fetch data on date change
  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, currentPage, itemsPerPage]);

  // Toggle worker selection for bulk mode
  const toggleWorkerSelection = (workerId: number) => {
    const newSelected = new Set(selectedWorkers);
    if (newSelected.has(workerId)) {
      newSelected.delete(workerId);
    } else {
      newSelected.add(workerId);
    }
    setSelectedWorkers(newSelected);
  };

  // Select all/none
  const toggleSelectAll = () => {
    if (selectedWorkers.size === filteredAttendance.length) {
      setSelectedWorkers(new Set());
    } else {
      const allIds = new Set(filteredAttendance.map(record => record.worker_id));
      setSelectedWorkers(allIds);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const wsData = [
      ["ATTENDANCE REPORT"],
      [`Date: ${selectedDate}`],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      ["SL", "Name", "IQAMA", "Card No", "Room", "Supplier", "Breakfast", "Lunch", "Dinner", "Notes"]
    ];

    filteredAttendance.forEach((record:any, index:any) => {
      wsData.push([
        index + 1,
        record.name,
        record.iqama_number,
        record.card_number || "",
        record.roomNumber || "",
        record.supplier,
        record.breakfast === 'present' ? '✓' : record.breakfast === 'absent' ? '✗' : '-',
        record.lunch === 'present' ? '✓' : record.lunch === 'absent' ? '✗' : '-',
        record.dinner === 'present' ? '✓' : record.dinner === 'absent' ? '✗' : '-',
        record.notes || ""
      ]);
    });

    // Add stats
    wsData.push([], ["STATISTICS"]);
    wsData.push(["Total Workers", stats.total.toString()]);
    wsData.push(["Breakfast", `${stats.breakfast_present} present, ${stats.breakfast_absent} absent (${stats.breakfast_percentage}%)`]);
    wsData.push(["Lunch", `${stats.lunch_present} present, ${stats.lunch_absent} absent (${stats.lunch_percentage}%)`]);
    wsData.push(["Dinner", `${stats.dinner_present} present, ${stats.dinner_absent} absent (${stats.dinner_percentage}%)`]);
    wsData.push(["Total Present", stats.total_present.toString()]);
    wsData.push(["Total Absent", stats.total_absent.toString()]);

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    
    // Set column widths
    const colWidths = [
      { wch: 5 }, { wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 10 }, 
      { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 30 }
    ];
    ws['!cols'] = colWidths;

    // Style header
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 9 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 9 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 9 } }
    ];

    XLSX.writeFile(wb, `Attendance_${selectedDate.replace(/-/g, '')}.xlsx`);
  };

  // Meal Status Component
  const MealStatus = ({ 
    meal, 
    status, 
    time 
  }: { 
    meal: 'breakfast' | 'lunch' | 'dinner', 
    status: 'present' | 'absent' | null,
    time?: string 
  }) => {
    const config = {
      breakfast: { icon: <Coffee size={14} />, color: 'orange' },
      lunch: { icon: <Utensils size={14} />, color: 'green' },
      dinner: { icon: <Moon size={14} />, color: 'blue' }
    };

    const { icon, color } = config[meal];

    return (
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 mb-1">
          {icon}
          <span className="text-xs font-medium capitalize">{meal}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          {status === 'present' ? (
            <>
              <button className={`p-1 rounded-full bg-green-100 text-green-800 hover:bg-green-200`}>
                <CheckCircle size={16} />
              </button>
              {time && <span className="text-xs text-gray-500">{time}</span>}
            </>
          ) : status === 'absent' ? (
            <button className={`p-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200`}>
              <XCircle size={16} />
            </button>
          ) : (
            <div className="flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // This will be handled by parent
                }}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <CheckCircle size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // This will be handled by parent
                }}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <XCircle size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Pagination Component
  const Pagination = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} records
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
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Food Attendance Management</h1>
          <p className="text-gray-600">Track Breakfast, Lunch, and Dinner attendance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <FileSpreadsheet size={18} />
            Export Excel
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <BarChart size={18} />
            Statistics
          </button>
          <button
            onClick={fetchAttendance}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Workers</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Breakfast</p>
                <p className="text-2xl font-bold text-green-600">{stats.breakfast_present}</p>
                <p className="text-sm text-gray-500">{stats.breakfast_percentage}% present</p>
              </div>
              <Coffee className="text-orange-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Lunch</p>
                <p className="text-2xl font-bold text-green-600">{stats.lunch_present}</p>
                <p className="text-sm text-gray-500">{stats.lunch_percentage}% present</p>
              </div>
              <Utensils className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dinner</p>
                <p className="text-2xl font-bold text-green-600">{stats.dinner_present}</p>
                <p className="text-sm text-gray-500">{stats.dinner_percentage}% present</p>
              </div>
              <Moon className="text-blue-500" size={24} />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Date Selection */}
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-lg p-2"
            />
            <button
              onClick={initializeAttendance}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Initialize Today
            </button>
          </div>

          {/* View Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode('summary')}
              className={`px-4 py-2 rounded-lg ${viewMode === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              Summary
            </button>
          </div>

          {/* Meal Filter */}
          <div className="flex gap-2">
            {(['all', 'breakfast', 'lunch', 'dinner'] as const).map((meal) => (
              <button
                key={meal}
                onClick={() => setMealFilter(meal)}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${mealFilter === meal ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                {meal === 'breakfast' && <Coffee size={16} />}
                {meal === 'lunch' && <Utensils size={16} />}
                {meal === 'dinner' && <Moon size={16} />}
                {meal === 'all' && 'All Meals'}
                {meal !== 'all' && meal.charAt(0).toUpperCase() + meal.slice(1)}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['all', 'present', 'absent'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${statusFilter === status ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}
              >
                {status === 'present' && <CheckCircle size={16} />}
                {status === 'absent' && <XCircle size={16} />}
                {status === 'all' && 'All Status'}
                {status !== 'all' && status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setBulkSelectMode(!bulkSelectMode)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${bulkSelectMode ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
            >
              {bulkSelectMode ? '✓ Bulk Mode' : 'Bulk Select'}
            </button>
            
            {bulkSelectMode && (
              <>
                <button
                  onClick={toggleSelectAll}
                  className="text-purple-600 hover:text-purple-800 text-sm"
                >
                  {selectedWorkers.size === filteredAttendance.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className="text-sm text-purple-600">
                  {selectedWorkers.size} workers selected
                </span>
              </>
            )}
          </div>

          {/* Bulk Action Buttons */}
          {bulkSelectMode && selectedWorkers.size > 0 && (
            <div className="flex gap-2">
              {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => (
                <div key={meal} className="flex gap-1">
                  <button
                    onClick={() => bulkMarkAttendance(meal, 'present')}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    {meal.charAt(0).toUpperCase() + meal.slice(1)} Present
                  </button>
                  <button
                    onClick={() => bulkMarkAttendance(meal, 'absent')}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    {meal.charAt(0).toUpperCase() + meal.slice(1)} Absent
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, IQAMA, card number, room, supplier..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading attendance data?...</p>
        </div>
      ) : filteredAttendance.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No attendance records found</h3>
          <p className="text-gray-500">
            {searchTerm ? `No records match "${searchTerm}"` : "No attendance data for this date"}
          </p>
          <button
            onClick={initializeAttendance}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Initialize Attendance
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    {bulkSelectMode && (
                      <th className="p-3 text-left w-12">
                        <input
                          type="checkbox"
                          checked={selectedWorkers.size === filteredAttendance.length && filteredAttendance.length > 0}
                          onChange={toggleSelectAll}
                          className="rounded"
                        />
                      </th>
                    )}
                    <th className="p-3 text-left">SL</th>
                    <th className="p-3 text-left">Worker Name</th>
                    <th className="p-3 text-left">IQAMA</th>
                    <th className="p-3 text-left">Card No</th>
                    <th className="p-3 text-left">Room</th>
                    <th className="p-3 text-left">Supplier</th>
                    <th className="p-3 text-left">Breakfast</th>
                    <th className="p-3 text-left">Lunch</th>
                    <th className="p-3 text-left">Dinner</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredAttendance
                    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                    .map((record, index) => (
                    <tr key={record.worker_id} className="hover:bg-gray-50">
                      {bulkSelectMode && (
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedWorkers.has(record.worker_id)}
                            onChange={() => toggleWorkerSelection(record.worker_id)}
                            className="rounded"
                          />
                        </td>
                      )}
                      <td className="p-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="p-3">
                        <div className="font-medium">{record.name}</div>
                        <div className="text-sm text-gray-500">{record.position}</div>
                      </td>
                      <td className="p-3 font-mono">{record.iqama_number}</td>
                      <td className="p-3 font-mono font-bold">{record.card_number}</td>
                      <td className="p-3">{record.roomNumber}</td>
                      <td className="p-3">{record.supplier}</td>
                      
                      {/* Breakfast */}
                      <td className="p-3">
                        <div className="flex justify-center">
                          {record.breakfast === 'present' ? (
                            <div className="text-center">
                              <CheckCircle className="text-green-600 mx-auto" size={20} />
                              <div className="text-xs text-gray-500">{record.breakfast_time}</div>
                            </div>
                          ) : record.breakfast === 'absent' ? (
                            <XCircle className="text-red-600 mx-auto" size={20} />
                          ) : (
                            <div className="flex gap-1">
                              <button
                                onClick={() => markAttendance(record.worker_id, 'breakfast', 'present')}
                                className="p-1 rounded-full bg-green-100 text-green-800 hover:bg-green-200"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => markAttendance(record.worker_id, 'breakfast', 'absent')}
                                className="p-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200"
                              >
                                <XCircle size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Lunch */}
                      <td className="p-3">
                        <div className="flex justify-center">
                          {record.lunch === 'present' ? (
                            <div className="text-center">
                              <CheckCircle className="text-green-600 mx-auto" size={20} />
                              <div className="text-xs text-gray-500">{record.lunch_time}</div>
                            </div>
                          ) : record.lunch === 'absent' ? (
                            <XCircle className="text-red-600 mx-auto" size={20} />
                          ) : (
                            <div className="flex gap-1">
                              <button
                                onClick={() => markAttendance(record.worker_id, 'lunch', 'present')}
                                className="p-1 rounded-full bg-green-100 text-green-800 hover:bg-green-200"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => markAttendance(record.worker_id, 'lunch', 'absent')}
                                className="p-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200"
                              >
                                <XCircle size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      {/* Dinner */}
                      <td className="p-3">
                        <div className="flex justify-center">
                          {record.dinner === 'present' ? (
                            <div className="text-center">
                              <CheckCircle className="text-green-600 mx-auto" size={20} />
                              <div className="text-xs text-gray-500">{record.dinner_time}</div>
                            </div>
                          ) : record.dinner === 'absent' ? (
                            <XCircle className="text-red-600 mx-auto" size={20} />
                          ) : (
                            <div className="flex gap-1">
                              <button
                                onClick={() => markAttendance(record.worker_id, 'dinner', 'present')}
                                className="p-1 rounded-full bg-green-100 text-green-800 hover:bg-green-200"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => markAttendance(record.worker_id, 'dinner', 'absent')}
                                className="p-1 rounded-full bg-red-100 text-red-800 hover:bg-red-200"
                              >
                                <XCircle size={18} />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="p-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              (['breakfast', 'lunch', 'dinner'] as const).forEach(meal => 
                                markAttendance(record.worker_id, meal, 'present')
                              );
                            }}
                            className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
                          >
                            All Present
                          </button>
                          <button
                            onClick={() => {
                              (['breakfast', 'lunch', 'dinner'] as const).forEach(meal => 
                                markAttendance(record.worker_id, meal, 'absent')
                              );
                            }}
                            className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200"
                          >
                            All Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {filteredAttendance.length} of {attendance.length} records
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Present: {stats.total_present}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Absent: {stats.total_absent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span>Pending: {stats.total * 3 - (stats.total_present + stats.total_absent)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <Pagination />
        </>
      )}
    </div>
  );
};

export default AttendanceTab;