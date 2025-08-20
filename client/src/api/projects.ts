import api from './api';

export interface Project {
  _id: string;
  title: string;
  description: string;
  technologies: string[];
  status: 'planning' | 'in-progress' | 'completed' | 'archived';
  startDate: string;
  endDate?: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  collaborators: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  technologies: string[];
  status: 'planning' | 'in-progress' | 'completed' | 'archived';
  startDate: string;
  endDate?: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  collaborators: string[];
  tags: string[];
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  _id: string;
}

// Description: Get all projects for the current user
// Endpoint: GET /api/projects
// Request: {}
// Response: { projects: Project[] }
export const getProjects = async (): Promise<{ projects: Project[] }> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        projects: [
          {
            _id: '1',
            title: 'E-commerce Platform',
            description: 'A full-stack e-commerce platform built with React and Node.js',
            technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
            status: 'completed',
            startDate: '2023-01-15',
            endDate: '2023-06-30',
            githubUrl: 'https://github.com/user/ecommerce-platform',
            liveUrl: 'https://ecommerce-demo.com',
            imageUrl: '/images/ecommerce-project.jpg',
            category: 'Web Development',
            priority: 'high',
            collaborators: [],
            tags: ['fullstack', 'ecommerce', 'responsive'],
            createdAt: '2023-01-15T00:00:00.000Z',
            updatedAt: '2023-06-30T00:00:00.000Z',
            userId: 'user123'
          },
          {
            _id: '2',
            title: 'Task Management App',
            description: 'A collaborative task management application with real-time updates',
            technologies: ['Vue.js', 'Socket.io', 'PostgreSQL'],
            status: 'in-progress',
            startDate: '2023-07-01',
            githubUrl: 'https://github.com/user/task-manager',
            imageUrl: '/images/task-manager.jpg',
            category: 'Web Development',
            priority: 'medium',
            collaborators: ['collaborator1', 'collaborator2'],
            tags: ['collaboration', 'realtime', 'productivity'],
            createdAt: '2023-07-01T00:00:00.000Z',
            updatedAt: '2023-12-01T00:00:00.000Z',
            userId: 'user123'
          },
          {
            _id: '3',
            title: 'Mobile Weather App',
            description: 'A React Native weather application with location-based forecasts',
            technologies: ['React Native', 'Weather API', 'Redux'],
            status: 'planning',
            startDate: '2024-01-01',
            imageUrl: '/images/weather-app.jpg',
            category: 'Mobile Development',
            priority: 'low',
            collaborators: [],
            tags: ['mobile', 'weather', 'location'],
            createdAt: '2023-12-15T00:00:00.000Z',
            updatedAt: '2023-12-15T00:00:00.000Z',
            userId: 'user123'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/projects');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get a single project by ID
// Endpoint: GET /api/projects/:id
// Request: {}
// Response: Project
export const getProject = async (id: string): Promise<Project> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: id,
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce platform built with React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        status: 'completed',
        startDate: '2023-01-15',
        endDate: '2023-06-30',
        githubUrl: 'https://github.com/user/ecommerce-platform',
        liveUrl: 'https://ecommerce-demo.com',
        imageUrl: '/images/ecommerce-project.jpg',
        category: 'Web Development',
        priority: 'high',
        collaborators: [],
        tags: ['fullstack', 'ecommerce', 'responsive'],
        createdAt: '2023-01-15T00:00:00.000Z',
        updatedAt: '2023-06-30T00:00:00.000Z',
        userId: 'user123'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/projects/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Create a new project
// Endpoint: POST /api/projects
// Request: CreateProjectRequest
// Response: Project
export const createProject = async (projectData: CreateProjectRequest): Promise<Project> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: Date.now().toString(),
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'user123'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/projects', projectData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Update an existing project
// Endpoint: PUT /api/projects/:id
// Request: UpdateProjectRequest
// Response: Project
export const updateProject = async (id: string, projectData: Partial<CreateProjectRequest>): Promise<Project> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: id,
        title: 'Updated Project Title',
        description: 'Updated project description',
        technologies: ['React', 'Node.js'],
        status: 'in-progress',
        startDate: '2023-01-15',
        githubUrl: 'https://github.com/user/updated-project',
        category: 'Web Development',
        priority: 'medium',
        collaborators: [],
        tags: ['updated', 'project'],
        createdAt: '2023-01-15T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
        userId: 'user123',
        ...projectData
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/projects/${id}`, projectData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Delete a project
// Endpoint: DELETE /api/projects/:id
// Request: {}
// Response: { message: string }
export const deleteProject = async (id: string): Promise<{ message: string }> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Project deleted successfully' });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/projects/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Upload project image
// Endpoint: POST /api/projects/upload
// Request: FormData with image file
// Response: { imageUrl: string }
export const uploadProjectImage = async (file: File): Promise<{ imageUrl: string }> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ imageUrl: `/images/${file.name}` });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   const formData = new FormData();
  //   formData.append('image', file);
  //   return await api.post('/api/projects/upload', formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};