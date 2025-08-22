import api from './api';

export interface Collaborator {
  name: string;
  role: string;
  profileUrl?: string;
}

export interface MediaCoverage {
  title: string;
  url: string;
  publication?: string;
  publishedDate?: string;
  description?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  status: 'ideation' | 'researching' | 'planning' | 'in-progress' | 'completed' | 'on-hold';
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  paperUrl?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  imageUrl?: string;
  archived?: boolean;
  featured?: boolean;
  order?: number;
  startDate?: string;
  endDate?: string;
  openToCollaborators?: boolean;
  acceptingSponsors?: boolean;
  collaboratorCount?: number;
  collaborators?: Collaborator[];
  enthusiasmLevel?: 'Low' | 'Medium' | 'High' | 'Very High';
  mediaCoverage?: MediaCoverage[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  priority?: number;
  progress?: number;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  shortDescription?: string;
  status?: Project['status'];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  paperUrl?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  startDate?: string;
  endDate?: string;
  openToCollaborators?: boolean;
  acceptingSponsors?: boolean;
  collaboratorCount?: number;
  collaborators?: Collaborator[];
  enthusiasmLevel?: Project['enthusiasmLevel'];
  mediaCoverage?: MediaCoverage[];
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  shortDescription?: string;
  status?: Project['status'];
  technologies?: string[];
  liveUrl?: string;
  githubUrl?: string;
  paperUrl?: string;
  thumbnailUrl?: string;
  bannerUrl?: string;
  archived?: boolean;
  featured?: boolean;
  order?: number;
  startDate?: string;
  endDate?: string;
  openToCollaborators?: boolean;
  acceptingSponsors?: boolean;
  collaboratorCount?: number;
  collaborators?: Collaborator[];
  enthusiasmLevel?: Project['enthusiasmLevel'];
  mediaCoverage?: MediaCoverage[];
}

// Description: Get all projects for the authenticated user
// Endpoint: GET /api/projects
// Request: {}
// Response: { projects: Project[] }
export const getProjects = async () => {
  try {
    console.log('Projects API: Fetching all projects...');
    const response = await api.get('/api/projects');
    console.log('Projects API: Projects fetched successfully:', response.data.projects?.length || 0);
    return response.data;
  } catch (error) {
    console.error('Projects API: Error fetching projects:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get a single project by ID
// Endpoint: GET /api/projects/:id
// Request: {}
// Response: { project: Project }
export const getProject = async (id: string) => {
  try {
    console.log('Projects API: Fetching project by ID:', id);
    const response = await api.get(`/api/projects/${id}`);
    console.log('Projects API: Project fetched successfully:', response.data.project?.title);
    return response.data;
  } catch (error) {
    console.error('Projects API: Error fetching project:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new project
// Endpoint: POST /api/projects
// Request: CreateProjectRequest
// Response: { project: Project, message: string }
export const createProject = async (projectData: CreateProjectRequest) => {
  try {
    console.log('Projects API: Creating new project:', projectData.title);
    const response = await api.post('/api/projects', projectData);
    console.log('Projects API: Project created successfully:', response.data.project?._id);
    return response.data;
  } catch (error) {
    console.error('Projects API: Error creating project:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update an existing project
// Endpoint: PUT /api/projects/:id
// Request: UpdateProjectRequest
// Response: { project: Project, message: string }
export const updateProject = async (id: string, projectData: UpdateProjectRequest) => {
  try {
    console.log('Projects API: Updating project:', id, projectData);
    const response = await api.put(`/api/projects/${id}`, projectData);
    console.log('Projects API: Project updated successfully:', response.data.project?.title);
    return response.data;
  } catch (error) {
    console.error('Projects API: Error updating project:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a project
// Endpoint: DELETE /api/projects/:id
// Request: {}
// Response: { message: string }
export const deleteProject = async (id: string) => {
  try {
    console.log('Projects API: Deleting project:', id);
    const response = await api.delete(`/api/projects/${id}`);
    console.log('Projects API: Project deleted successfully');
    return response.data;
  } catch (error) {
    console.error('Projects API: Error deleting project:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Upload project image
// Endpoint: POST /api/projects/upload
// Request: FormData with 'image' file
// Response: { imageUrl: string }
export const uploadProjectImage = async (file: File) => {
  try {
    console.log('Projects API: Uploading project image:', file.name);
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/api/projects/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Projects API: Image uploaded successfully:', response.data.imageUrl);
    return response.data;
  } catch (error) {
    console.error('Projects API: Error uploading image:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update projects order
// Endpoint: PUT /api/projects/order
// Request: { projectIds: string[] }
// Response: { message: string }
export const updateProjectsOrder = async (projectIds: string[]) => {
  try {
    console.log('Projects API: Updating projects order:', projectIds);
    const response = await api.put('/api/projects/order', { projectIds });
    console.log('Projects API: Projects order updated successfully');
    return response.data;
  } catch (error) {
    console.error('Projects API: Error updating projects order:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};