// app/context/ChildContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Extended Child interface to match your existing data and add health info
export interface Child {
  id: number;
  name: string;
  age: string;
  gender: string;
  avatar: string;
  color: string;
  // Health data (optional for backward compatibility)
  height?: number;
  weight?: number;
  bmi?: number;
  developmentScore?: number;
  lastCheckup?: string;
  heightChange?: string;
  weightChange?: string;
  bmiStatus?: string;
}

interface ChildContextType {
  selectedChild: Child | null;
  children: Child[];
  setSelectedChild: (child: Child) => void;
  addChild: (child: Child) => void;
  updateChild: (childId: number, updates: Partial<Child>) => void;
  removeChild: (childId: number) => void;
}

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export const useChild = () => {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};

interface ChildProviderProps {
  children: ReactNode;
}

export const ChildProvider: React.FC<ChildProviderProps> = ({ children }) => {
  // Initialize with your existing data structure
  const [childrenList, setChildrenList] = useState<Child[]>([
    {
      id: 1,
      name: 'Malith Fernando',
      age: '2y 3m', // Standardized format for age calculations
      gender: 'Male',
      avatar: 'M',
      color: '#4A90E2',
      // Add health data
      height: 89,
      weight: 12.5,
      bmi: 15.8,
      developmentScore: 85,
      lastCheckup: 'July 25, 2025',
      heightChange: '+2 cm',
      weightChange: '+0.4 kg',
      bmiStatus: 'Normal'
    },
    {
      id: 2,
      name: 'Amaya Fernando',
      age: '6m', // 6 months
      gender: 'Female',
      avatar: 'A',
      color: '#E94B7D',
      // Add health data for the baby
      height: 68,
      weight: 8.2,
      bmi: 17.7,
      developmentScore: 78,
      lastCheckup: 'August 10, 2025',
      heightChange: '+3 cm',
      weightChange: '+0.8 kg',
      bmiStatus: 'Normal'
    },
  ]);

  // Start with first child selected by default
  const [selectedChild, setSelectedChild] = useState<Child | null>(
    childrenList.length > 0 ? childrenList[0] : null
  );

  const addChild = (child: Child) => {
    const newChild = {
      ...child,
      id: Math.max(...childrenList.map(c => c.id), 0) + 1
    };
    setChildrenList(prev => [...prev, newChild]);
    
    // Auto-select the new child
    setSelectedChild(newChild);
  };

  const updateChild = (childId: number, updates: Partial<Child>) => {
    setChildrenList(prev => 
      prev.map(child => 
        child.id === childId ? { ...child, ...updates } : child
      )
    );
    
    // Update selected child if it's the one being updated
    if (selectedChild?.id === childId) {
      setSelectedChild(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const removeChild = (childId: number) => {
    setChildrenList(prev => prev.filter(child => child.id !== childId));
    
    // If the removed child was selected, select another one or null
    if (selectedChild?.id === childId) {
      const remaining = childrenList.filter(child => child.id !== childId);
      setSelectedChild(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const contextValue: ChildContextType = {
    selectedChild,
    children: childrenList,
    setSelectedChild,
    addChild,
    updateChild,
    removeChild
  };

  return (
    <ChildContext.Provider value={contextValue}>
      {children}
    </ChildContext.Provider>
  );
};