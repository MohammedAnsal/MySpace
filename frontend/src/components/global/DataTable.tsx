import React, { useMemo, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { cn } from "../../lib/utils";

interface IColumns<T> {
  key?: string;
  header: string;
  render?: (item: T, i: number) => React.ReactNode;
  width?: string;
}

interface TableProps<T> {
  data: T[];
  columns: IColumns<T>[];
  itemsPerPage?: number;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  itemsPerPage = 5,
}: TableProps<T>) {
  const [currentPage, setCurrentpage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = useMemo(() => {
    const safeData = Array.isArray(data) ? data : []; // Ensure data is always an array
    const firstPage = (currentPage - 1) * itemsPerPage;
    const lastPage = firstPage + itemsPerPage;
    return safeData.slice(firstPage, lastPage);
  }, [currentPage, data, itemsPerPage]);

  const pageChange = (page: number) => {
    setCurrentpage(page);
  };

  const columnWidths = useMemo(() => {
    return columns.map((col) => {
      if (col.width) return col.width;
      return `${100 / columns.length}%`;
    });
  }, [columns]);

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Header Section */}
      <div className="bg-[#242529] border border-[#C8ED4F] rounded-2xl overflow-hidden">
        <div
          className="grid"
          style={{ gridTemplateColumns: columnWidths.join(" ") }}
        >
          {columns.map((e, i) => (
            <div
              key={i}
              className="flex bg-[#242529] h-14 text-gray-400 text-sm font-medium items-center px-6"
              style={{ width: "100%" }}
            >
              {e.header}
            </div>
          ))}
        </div>
      </div>

      {/* Body Section */}
      <div className="bg-[#242529] border border-[#C8ED4F] rounded-2xl overflow-hidden">
        {currentData.length ? (
          currentData.map((item, ind) => (
            <div
              key={(item as T)._id || ind}
              className="grid hover:bg-zinc-900/50 transition-colors"
              style={{
                gridTemplateColumns: columnWidths.join(" "),
                borderBottom:
                  ind !== currentData.length - 1
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "none",
              }}
            >
              {columns.map((e, i) => (
                <div
                  key={i}
                  className="flex h-14 text-gray-200 text-sm font-medium items-center px-6"
                  style={{ width: "100%" }}
                >
                  {e.render
                    ? e.render(item, ind)
                    : e.key
                    ? item[e.key]
                    : "Not found"}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="flex h-14 justify-center text-center text-gray-400 items-center">
            No data available
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center px-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && pageChange(currentPage - 1)}
                  className={cn(
                    "border border-[#C8ED4F] bg-[#242529] text-gray-400 hover:bg-zinc-900 hover:text-gray-300",
                    currentPage <= 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => pageChange(page)}
                      isActive={currentPage === page}
                      className={cn(
                        "border border-[#C8ED4F] bg-[#242529] text-gray-400 hover:bg-zinc-900 hover:text-gray-300",
                        currentPage === page &&
                          "bg-[#C8ED4F] text-black hover:bg-[#C8ED4F] hover:text-black"
                      )}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    currentPage < totalPages && pageChange(currentPage + 1)
                  }
                  className={cn(
                    "border border-[#C8ED4F] bg-[#242529] text-gray-400 hover:bg-zinc-900 hover:text-gray-300",
                    currentPage >= totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
