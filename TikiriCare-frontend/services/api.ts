// API configuration and service functions
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8080';

// Helper function to get auth token
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// API call helper
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = await getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    return await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string, name: string, telephone?: string) => {
    return await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, telephone, role: 'parent' }),
    });
  },
};

// Children API calls
export const childrenAPI = {
  getChildren: async () => {
    return await apiCall('/children');
  },

  addChild: async (childData: {
    name: string;
    gender: string;
    dateOfBirth: string;
    height?: number;
    weight?: number;
  }) => {
    return await apiCall('/children', {
      method: 'POST',
      body: JSON.stringify(childData),
    });
  },

  getChild: async (childId: string) => {
    return await apiCall(`/children/${childId}`);
  },

  addGrowthRecord: async (childId: string, growthData: {
    height: number;
    weight: number;
    recordedDate: string;
  }) => {
    return await apiCall(`/children/${childId}/growth`, {
      method: 'POST',
      body: JSON.stringify(growthData),
    });
  },
};

// Caregiver API calls (for TikiriPiyasa)
export const caregiverAPI = {
  getCaregivers: async () => {
    return await apiCall('/caregivers');
  },

  registerCaregiver: async (caregiverData: {
    name: string;
    specialization: string;
    experience: string;
    location: string;
    contactNumber: string;
    services: string[];
  }) => {
    return await apiCall('/caregivers/register', {
      method: 'POST',
      body: JSON.stringify(caregiverData),
    });
  },
};

// Test backend connection
export const testConnection = async () => {
  try {
    const response = await apiCall('/health');
    return response;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return { success: false, error: 'Backend not reachable' };
  }
};
