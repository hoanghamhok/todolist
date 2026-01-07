import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
}


export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  footer,
  hoverable = false,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-white rounded-lg border border-gray-200 shadow-sm
        ${hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
      `}
    >
      {title && (
        <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-900">
          {title}
        </div>
      )}
      <div className="px-4 py-3">
        {children}
      </div>
      {footer && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  );
};