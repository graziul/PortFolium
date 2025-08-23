import api from './api';

export interface Collaborator {
  _id: string;
  name: string;
  email: string;
  type: 'postdoc' | 'junior_faculty' | 'senior_faculty' | 'industry_tech' | 'industry_finance' | 'industry_healthcare' | 'undergraduate' | 'graduate' | 'professional_ethicist' | 'journalist';
  institution?: string;
  role?: string;
  profileUrl?: string;
  bio?: string;
  skills?: string[];
  projectIds?: string[];
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Description: Get all collaborators
// Endpoint: GET /api/collaborators
// Request: {}
// Response: { collaborators: Array<Collaborator> }
export const getCollaborators = async () => {
  console.log('Collaborators API: Fetching all collaborators...');
  
  try {
    const response = await api.get('/api/collaborators');
    console.log('Collaborators API: Collaborators fetched successfully:', response.data.collaborators.length);
    return response.data;
  } catch (error) {
    console.error('Collaborators API: Error fetching collaborators:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get a single collaborator by ID
// Endpoint: GET /api/collaborators/:id
// Request: { id: string }
// Response: { collaborator: Collaborator }
export const getCollaborator = async (id: string) => {
  console.log('Collaborators API: Fetching collaborator:', id);
  
  try {
    const response = await api.get(`/api/collaborators/${id}`);
    console.log('Collaborators API: Collaborator fetched successfully');
    return response.data;
  } catch (error) {
    console.error('Collaborators API: Error fetching collaborator:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new collaborator
// Endpoint: POST /api/collaborators
// Request: { name: string, email: string, type: string, institution?: string, role?: string, bio?: string, skills?: string[], projectIds?: string[] }
// Response: { collaborator: Collaborator, message: string }
export const createCollaborator = async (collaboratorData: Partial<Collaborator>) => {
  console.log('Collaborators API: Creating collaborator:', collaboratorData);
  
  try {
    const response = await api.post('/api/collaborators', collaboratorData);
    console.log('Collaborators API: Collaborator created successfully');
    return response.data;
  } catch (error) {
    console.error('Collaborators API: Error creating collaborator:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update a collaborator
// Endpoint: PUT /api/collaborators/:id
// Request: { id: string, updates: Partial<Collaborator> }
// Response: { collaborator: Collaborator, message: string }
export const updateCollaborator = async (id: string, updates: Partial<Collaborator>) => {
  console.log('Collaborators API: Updating collaborator:', id, updates);
  
  try {
    const response = await api.put(`/api/collaborators/${id}`, updates);
    console.log('Collaborators API: Collaborator updated successfully');
    return response.data;
  } catch (error) {
    console.error('Collaborators API: Error updating collaborator:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a collaborator
// Endpoint: DELETE /api/collaborators/:id
// Request: { id: string }
// Response: { message: string }
export const deleteCollaborator = async (id: string) => {
  console.log('Collaborators API: Deleting collaborator:', id);
  
  try {
    const response = await api.delete(`/api/collaborators/${id}`);
    console.log('Collaborators API: Collaborator deleted successfully');
    return response.data;
  } catch (error) {
    console.error('Collaborators API: Error deleting collaborator:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get collaborator statistics
// Endpoint: GET /api/collaborators/stats/summary
// Request: {}
// Response: { stats: Array<{ _id: string, count: number }> }
export const getCollaboratorStats = async () => {
  console.log('Collaborators API: Fetching collaborator statistics...');
  
  try {
    const response = await api.get('/api/collaborators/stats/summary');
    console.log('Collaborators API: Collaborator stats fetched successfully');
    return response.data;
  } catch (error) {
    console.error('Collaborators API: Error fetching collaborator stats:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};