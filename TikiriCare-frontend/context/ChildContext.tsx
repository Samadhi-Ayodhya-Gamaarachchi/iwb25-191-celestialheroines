// app/context/ChildContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { childrenAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

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
  refreshChildren: () => Promise<void>;
  isLoading: boolean;
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
  const { user } = useAuth();
  
  // Initialize with empty array - data will be loaded from API
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Start with no child selected initially
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  // Load children from API when user is authenticated
  useEffect(() => {
    if (user) {
      refreshChildren();
    } else {
      setChildrenList([]);
      setSelectedChild(null);
    }
  }, [user]);

  const refreshChildren = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await childrenAPI.getChildren();
      
      if (response.children && Array.isArray(response.children)) {
        const transformedChildren = response.children.map((child: any) => ({
          id: child.id,
          name: child.name,
          age: child.age,
          gender: child.gender,
          avatar: child.name.charAt(0).toUpperCase(),
          color: child.gender === 'male' ? '#4A90E2' : '#E94B7D',
          height: child.height,
          weight: child.weight,
          bmi: child.bmi,
          developmentScore: child.developmentScore || 85,
          lastCheckup: child.lastCheckup,
          heightChange: child.heightChange,
          weightChange: child.weightChange,
          bmiStatus: child.bmiStatus || 'Normal'
        }));
        
        setChildrenList(transformedChildren);
        
        // Auto-select first child if none selected
        if (transformedChildren.length > 0 && !selectedChild) {
          setSelectedChild(transformedChildren[0]);
        }
      } else {
        setChildrenList([]);
      }
    } catch (error) {
      console.error('Error loading children:', error);
      setChildrenList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addChild = async (child: Child) => {
    try {
      // Convert age to dateOfBirth (approximate calculation)
      const calculateDateOfBirth = (age: string) => {
        const now = new Date();
        const years = parseInt(age.match(/(\d+)y/)?.[1] || '0');
        const months = parseInt(age.match(/(\d+)m/)?.[1] || '0');
        const birthDate = new Date(now.getFullYear() - years, now.getMonth() - months);
        return birthDate.toISOString().split('T')[0];
      };
      
      const newChildData = {
        name: child.name,
        gender: child.gender.toLowerCase(),
        dateOfBirth: calculateDateOfBirth(child.age),
        height: child.height,
        weight: child.weight,
      };
      
      const response = await childrenAPI.addChild(newChildData);
      
      if (response.child) {
        const transformedChild = {
          ...child,
          id: response.child.id,
          avatar: child.name.charAt(0).toUpperCase(),
          color: child.gender.toLowerCase() === 'male' ? '#4A90E2' : '#E94B7D',
          developmentScore: 85
        };
        
        setChildrenList(prev => [...prev, transformedChild]);
        setSelectedChild(transformedChild);
      }
    } catch (error) {
      console.error('Error adding child:', error);
      // Fallback to local add if API fails
      const newChild = {
        ...child,
        id: Math.max(...childrenList.map(c => c.id), 0) + 1
      };
      setChildrenList(prev => [...prev, newChild]);
      setSelectedChild(newChild);
    }
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
    removeChild,
    refreshChildren,
    isLoading
  };

  return (
    <ChildContext.Provider value={contextValue}>
      {children}
    </ChildContext.Provider>
  );
};