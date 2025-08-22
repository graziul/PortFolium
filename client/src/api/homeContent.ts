import api from './api';

export interface HomeContent {
  _id?: string;
  name: string;
  tagline: string;
  bio: string;
  profileImageUrl?: string;
  yearsExperience: number;
  coreExpertise: string[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  collaboratorStats?: {
    academia: { total: number; subcategories: { postdoc: number; junior_faculty: number; senior_faculty: number } };
    industry: { total: number; subcategories: { industry_tech: number; industry_finance: number; industry_healthcare: number } };
    students: { total: number; subcategories: { undergraduate: number; graduate: number } };
    others: { total: number; subcategories: { professional_ethicist: number; journalist: number } };
  };
  heroBackgroundColor?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Collaborator {
  name: string;
  type: 'postdoc' | 'junior_faculty' | 'senior_faculty' | 'industry_tech' | 'industry_finance' | 'industry_healthcare' | 'undergraduate' | 'graduate' | 'professional_ethicist' | 'journalist';
}

// Description: Get home content
// Endpoint: GET /api/home-content
// Request: {}
// Response: { homeContent: HomeContent }
export const getHomeContent = async () => {
  console.log('HomeContent API: Fetching home content...');
  
  try {
    const response = await api.get('/api/home-content');
    console.log('HomeContent API: Home content fetched successfully');
    return response.data;
  } catch (error) {
    console.error('HomeContent API: Error fetching home content:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update home content
// Endpoint: PUT /api/home-content
// Request: { homeContent: Partial<HomeContent>, collaborators?: Collaborator[] }
// Response: { homeContent: HomeContent, message: string }
export const updateHomeContent = async (contentData: Partial<HomeContent> & { collaborators?: Collaborator[] }) => {
  console.log('HomeContent API: Updating home content:', contentData);
  
  try {
    const response = await api.put('/api/home-content', contentData);
    console.log('HomeContent API: Home content updated successfully');
    return response.data;
  } catch (error) {
    console.error('HomeContent API: Error updating home content:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get collaborators data for editing
// Endpoint: GET /api/home-content/collaborators
// Request: {}
// Response: { collaborators: Collaborator[] }
export const getCollaborators = async () => {
  console.log('HomeContent API: Fetching collaborators data...');
  
  try {
    const response = await api.get('/api/home-content/collaborators');
    console.log('HomeContent API: Collaborators data fetched successfully');
    return response.data;
  } catch (error) {
    console.error('HomeContent API: Error fetching collaborators data:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Upload profile image
// Endpoint: POST /api/home-content/upload-profile-image
// Request: FormData with 'profileImage' field
// Response: { imageUrl: string }
export const uploadProfileImage = async (file: File) => {
  console.log('HomeContent API: Uploading profile image:', file.name);
  
  try {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    const response = await api.post('/api/home-content/upload-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('HomeContent API: Profile image uploaded successfully');
    return response.data;
  } catch (error) {
    console.error('HomeContent API: Error uploading profile image:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};