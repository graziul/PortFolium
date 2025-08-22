import api from './api';

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  bio: string;
  location: string;
  phone: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
    website: string;
  };
  experiences?: Experience[];
  education?: Education[];
  certifications?: string[];
  languages?: string[];
  createdAt: string;
  lastLoginAt: string;
  isActive: boolean;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  location?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  experiences?: Experience[];
  education?: Education[];
  certifications?: string[];
  languages?: string[];
}

// Description: Get current user's profile information
// Endpoint: GET /api/users/profile
// Request: {}
// Response: UserProfile
export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    console.log('Profile API: Starting getUserProfile request');
    console.log('Profile API: Making GET request to /api/users/profile');
    
    const response = await api.get('/api/users/profile');
    
    console.log('Profile API: Received response from /api/users/profile');
    console.log('Profile API: Response status:', response.status);
    console.log('Profile API: Response data:', response.data);
    console.log('Profile API: User profile fetched successfully');
    
    return response.data;
  } catch (error: any) {
    console.error('Profile API: Error in getUserProfile');
    console.error('Profile API: Error object:', error);
    console.error('Profile API: Error message:', error.message);
    console.error('Profile API: Error response:', error.response);
    console.error('Profile API: Error response status:', error.response?.status);
    console.error('Profile API: Error response data:', error.response?.data);
    console.error('Profile API: Error response headers:', error.response?.headers);
    
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update current user's profile information
// Endpoint: PUT /api/users/profile
// Request: UpdateProfileData
// Response: UserProfile
export const updateUserProfile = async (profileData: UpdateProfileData): Promise<UserProfile> => {
  try {
    console.log('Profile API: Starting updateUserProfile with data:', profileData);
    console.log('Profile API: Making PUT request to /api/users/profile');
    const response = await api.put('/api/users/profile', profileData);
    console.log('Profile API: Received response:', response);
    console.log('Profile API: Response data:', response.data);
    console.log('Profile API: User profile updated successfully');
    return response.data;
  } catch (error: any) {
    console.error('Profile API: Error updating user profile:', error);
    console.error('Profile API: Error response:', error.response);
    console.error('Profile API: Error response data:', error.response?.data);
    console.error('Profile API: Error response status:', error.response?.status);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Add professional experience to user profile
// Endpoint: POST /api/users/profile/experience
// Request: Omit<Experience, 'id'>
// Response: Experience
export const addExperience = async (experienceData: Omit<Experience, 'id'>): Promise<Experience> => {
  try {
    console.log('Profile API: Adding experience...', experienceData);
    const response = await api.post('/api/users/profile/experience', experienceData);
    console.log('Profile API: Experience added successfully');
    return response.data;
  } catch (error: any) {
    console.error('Profile API: Error adding experience:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update professional experience in user profile
// Endpoint: PUT /api/users/profile/experience/:id
// Request: Omit<Experience, 'id'>
// Response: Experience
export const updateExperience = async (experienceId: string, experienceData: Omit<Experience, 'id'>): Promise<Experience> => {
  try {
    console.log('Profile API: Updating experience...', experienceId, experienceData);
    const response = await api.put(`/api/users/profile/experience/${experienceId}`, experienceData);
    console.log('Profile API: Experience updated successfully');
    return response.data;
  } catch (error: any) {
    console.error('Profile API: Error updating experience:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete professional experience from user profile
// Endpoint: DELETE /api/users/profile/experience/:id
// Request: {}
// Response: { message: string }
export const deleteExperience = async (experienceId: string): Promise<{ message: string }> => {
  try {
    console.log('Profile API: Deleting experience...', experienceId);
    const response = await api.delete(`/api/users/profile/experience/${experienceId}`);
    console.log('Profile API: Experience deleted successfully');
    return response.data;
  } catch (error: any) {
    console.error('Profile API: Error deleting experience:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Add education to user profile
// Endpoint: POST /api/users/profile/education
// Request: Omit<Education, 'id'>
// Response: Education
export const addEducation = async (educationData: Omit<Education, 'id'>): Promise<Education> => {
  try {
    console.log('Profile API: Adding education...', educationData);
    const response = await api.post('/api/users/profile/education', educationData);
    console.log('Profile API: Education added successfully');
    return response.data;
  } catch (error: any) {
    console.error('Profile API: Error adding education:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update education in user profile
// Endpoint: PUT /api/users/profile/education/:id
// Request: Omit<Education, 'id'>
// Response: Education
export const updateEducation = async (educationId: string, educationData: Omit<Education, 'id'>): Promise<Education> => {
  try {
    console.log('Profile API: Updating education...', educationId, educationData);
    const response = await api.put(`/api/users/profile/education/${educationId}`, educationData);
    console.log('Profile API: Education updated successfully');
    return response.data;
  } catch (error: any) {
    console.error('Profile API: Error updating education:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete education from user profile
// Endpoint: DELETE /api/users/profile/education/:id
// Request: {}
// Response: { message: string }
export const deleteEducation = async (educationId: string): Promise<{ message: string }> => {
  try {
    console.log('Profile API: Deleting education...', educationId);
    const response = await api.delete(`/api/users/profile/education/${educationId}`);
    console.log('Profile API: Education deleted successfully');
    return response.data;
  } catch (error: any) {
    console.error('Profile API: Error deleting education:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};