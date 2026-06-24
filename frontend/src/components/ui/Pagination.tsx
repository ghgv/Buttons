// components/ui/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

export function Pagination({
  currentPage,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  totalItems,
  itemsPerPage,
}: PaginationProps) {
  return (
    <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50/50">
      {totalItems !== undefined && itemsPerPage !== undefined && (
        <div className="text-sm text-gray-500">
          Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} registros
        </div>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className={`
            flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors
            ${hasPrevPage 
              ? 'text-gray-700 hover:bg-gray-200' 
              : 'text-gray-300 cursor-not-allowed'
            }
          `}
        >
          <ChevronLeft size={16} />
          Anterior
        </button>
        
        <span className="px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg">
          {currentPage}
        </span>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={`
            flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors
            ${hasNextPage 
              ? 'text-gray-700 hover:bg-gray-200' 
              : 'text-gray-300 cursor-not-allowed'
            }
          `}
        >
          Siguiente
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}