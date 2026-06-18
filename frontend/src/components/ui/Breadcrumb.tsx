// components/ui/Breadcrumb.tsx
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate?: (path: string) => void;
}

export default function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center gap-1 text-sm mb-6 overflow-x-auto py-2" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={item.path} className="flex items-center gap-1 flex-shrink-0">
            {/* {index === 0 && (
              <Home size={14} className="text-gray-400 mr-1" />
            )} */}
            
            {isLast ? (
              // Elemento actual - no clickeable
              <span className="flex items-center gap-1.5 px-2 py-1 text-purple-700 font-medium">
                {item.icon && <span className="text-purple-500">{item.icon}</span>}
                {item.label}
              </span>
            ) : (
              // Elemento clickeable
              <button
                onClick={() => handleNavigate(item.path)}
                className="flex items-center gap-1.5 px-2 py-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 hover:scale-105"
              >
                {item.icon && <span className="text-gray-400">{item.icon}</span>}
                {item.label}
              </button>
            )}
            
            {!isLast && (
              <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </nav>
  );
}