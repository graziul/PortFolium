import api from './api';

export interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  technologies: string[];
  status: 'researching' | 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  githubUrl?: string;
  liveUrl?: string;
  paperUrl?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  imageUrl?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  collaborators: string[];
  tags: string[];
  archived?: boolean;
  featured?: boolean;
  openToCollaborators?: boolean;
  acceptingSponsors?: boolean;
  collaboratorCount?: number;
  enthusiasmLevel?: string;
  mediaCoverage?: MediaCoverage[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface MediaCoverage {
  _id?: string;
  title: string;
  url: string;
  source: string;
  date: string;
  description?: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  shortDescription?: string;
  technologies: string[];
  status: 'researching' | 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate?: string;
  endDate?: string;
  githubUrl?: string;
  liveUrl?: string;
  paperUrl?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  collaborators: string[];
  tags: string[];
  archived?: boolean;
  featured?: boolean;
  openToCollaborators?: boolean;
  acceptingSponsors?: boolean;
  collaboratorCount?: number;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  _id: string;
}

// Description: Get all projects for the current user
// Endpoint: GET /api/projects
// Request: {}
// Response: { projects: Project[] }
export const getProjects = async (): Promise<{ projects: Project[] }> => {
  console.log('ProjectsAPI: Fetching projects from backend');
  try {
    const response = await api.get('/api/projects');
    console.log('ProjectsAPI: Projects fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('ProjectsAPI: Error fetching projects:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get a single project by ID
// Endpoint: GET /api/projects/:id
// Request: {}
// Response: { project: Project }
export const getProject = async (id: string): Promise<{ project: Project }> => {
  console.log('ProjectsAPI: Fetching project by ID:', id);
  try {
    const response = await api.get(`/api/projects/${id}`);
    console.log('ProjectsAPI: Project fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('ProjectsAPI: Error fetching project:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new project
// Endpoint: POST /api/projects
// Request: CreateProjectRequest
// Response: { project: Project, message: string }
export const createProject = async (projectData: CreateProjectRequest): Promise<{ project: Project, message: string }> => {
  console.log('ProjectsAPI: Creating project:', projectData);
  try {
    const response = await api.post('/api/projects', projectData);
    console.log('ProjectsAPI: Project created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('ProjectsAPI: Error creating project:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update an existing project
// Endpoint: PUT /api/projects/:id
// Request: Partial<CreateProjectRequest>
// Response: { project: Project, message: string }
export const updateProject = async (id: string, projectData: Partial<CreateProjectRequest>): Promise<{ project: Project, message: string }> => {
  console.log('ProjectsAPI: Updating project:', id, projectData);
  try {
    const response = await api.put(`/api/projects/${id}`, projectData);
    console.log('ProjectsAPI: Project updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('ProjectsAPI: Error updating project:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a project
// Endpoint: DELETE /api/projects/:id
// Request: {}
// Response: { message: string }
export const deleteProject = async (id: string): Promise<{ message: string }> => {
  console.log('ProjectsAPI: Deleting project:', id);
  try {
    const response = await api.delete(`/api/projects/${id}`);
    console.log('ProjectsAPI: Project deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('ProjectsAPI: Error deleting project:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Upload project image
// Endpoint: POST /api/projects/upload
// Request: FormData with image file
// Response: { imageUrl: string }
export const uploadProjectImage = async (file: File): Promise<{ imageUrl: string }> => {
  console.log('ProjectsAPI: Uploading project image:', file.name);
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post('/api/projects/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('ProjectsAPI: Image upload response:', response.data);

    // Convert relative path to full URL
    const imageUrl = response.data.imageUrl.startsWith('http')
      ? response.data.imageUrl
      : `http://localhost:3000${response.data.imageUrl}`;

    console.log('ProjectsAPI: Full image URL:', imageUrl);
    return { imageUrl };
  } catch (error) {
    console.error('ProjectsAPI: Error uploading image:', error);
    
    // Provide more specific error messages
    if (error?.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw new Error(error?.response?.data?.message || error.message || 'Failed to upload image');
  }
};