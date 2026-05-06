"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

type CommonDataGridProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  maxHeight?: string;
};

export default function CommonDataGrid<T>({
  columns,
  data,
  totalRecords,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  maxHeight = "400px",
}: CommonDataGridProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div>
      <div
        className={`overflow-x-auto overflow-y-auto bg-white`}
        style={{ maxHeight }}
      >
        <table className="min-w-full bg-white border-border text-sm">
          <thead className="bg-header sticky top-0 text-xs font-semibold text-white border-b-2">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className="px-3 py-1 text-left"
                    style={
                      index === 0
                        ? { borderTopLeftRadius: "8px" }
                        : index === hg.headers.length - 1
                        ? { borderTopRightRadius: "8px" }
                        : {}
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="border border-border">
            {data.map((row, index) => (
              <tr
                key={(row as any).id || index}
                className={`hover:bg-gray-100 ${
                  index % 2 === 0 ? "bg-slate-300" : ""
                }`}
              >
                {table.getHeaderGroups()[0].headers.map((header) => {
                  const key = header.column.id;
                  return (
                    <td key={key} className="px-3 py-1 text-sm border-b">
                      {(row as any)[key]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-wrap text-xs font-semibold items-center gap-3 mt-4">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded-full disabled:opacity-50"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            « First
          </button>

          <button
            className="px-3 py-1 border rounded-full disabled:opacity-50"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹ Prev
          </button>

          <button
            className="px-3 py-1 border rounded-full disabled:opacity-50"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ›
          </button>

          <button
            className="px-3 py-1 border rounded-full disabled:opacity-50"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last »
          </button>
        </div>

        <span className="ml-auto">
          Page <strong>{currentPage}</strong> of {totalPages}
        </span>

        <label className="flex items-center gap-2">
          Rows:
          <select
            className="border px-2 py-1 rounded"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
