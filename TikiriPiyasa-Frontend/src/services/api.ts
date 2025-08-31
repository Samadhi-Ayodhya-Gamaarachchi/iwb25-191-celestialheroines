// API configuration and service functions for TikiriPiyasa
const API_BASE_URL = 'http://192.168.26.43:8080';

// Helper function to get auth token
export const getAuthToken = async () => {
  try {
    // For now, we'll implement basic auth. In production, get from AsyncStorage
    return null;
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
const authAPI = {
  login: async (email: string, password: string) => {
    return await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string, name: string, telephone?: string) => {
    return await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, telephone, role: 'caregiver' }),
    });
  },
};

// Caregiver API calls (Primary for TikiriPiyasa)
const caregiverAPI = {
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

// Children API calls (For care requests)
const childrenAPI = {
  getChildren: async () => {
    return await apiCall('/children');
  },

  getChild: async (childId: string) => {
    return await apiCall(`/children/${childId}`);
  },
};

// Care Request API calls
const careRequestAPI = {
  getCareRequests: async () => {
    return await apiCall('/care-requests');
  },

  createCareRequest: async (requestData: {
    childId: string;
    serviceType: string;
    description: string;
    preferredDate: string;
    preferredTime: string;
  }) => {
    return await apiCall('/care-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
};

// Test backend connection
const testConnection = async () => {
  try {
    const response = await apiCall('/health');
    return response;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return { success: false, error: 'Backend not reachable' };
  }
};

// Export all APIs
export { authAPI, caregiverAPI, childrenAPI, careRequestAPI, testConnection };
