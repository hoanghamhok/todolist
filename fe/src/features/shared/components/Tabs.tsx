import type { ReactNode } from "react";
import React from "react";
import { useState } from "react";

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  onChange?: (value: string) => void;
}

interface TabsListProps {
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  activeTab?: string;
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value:any) => {
    setActiveTab(value);
    onChange?.(value);
  };

  return (
    <div className="w-full">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            activeTab, 
            onTabChange: handleTabChange 
          });
        }
        return child;
      })}
    </div>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex gap-1">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { 
              activeTab, 
              onTabChange 
            });
          }
          return child;
        })}
      </nav>
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, activeTab, onTabChange }) => {
  const isActive = activeTab === value;
  
  return (
    <button
      onClick={() => onTabChange?.(value)}
      className={`
        px-4 py-2 font-medium text-sm border-b-2 transition-colors
        ${isActive 
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        }
      `}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, activeTab }) => {
  if (activeTab !== value) return null;
  
  return <div className="py-4">{children}</div>;
};
