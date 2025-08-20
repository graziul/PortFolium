export interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  technologies: string[];
  startDate?: string;
  endDate?: string;
  githubUrl?: string;
  liveUrl?: string;
  paperUrl?: string;
  collaborators?: string[];
  priority?: 'low' | 'medium' | 'high';
  progress?: number;
  enthusiasmLevel?: 'low' | 'medium' | 'high' | 'very-high';
  mediaCoverage?: MediaCoverage[];
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaCoverage {
  _id?: string;
  title: string;
  url: string;
  publication: string;
  publishedDate: string;
  description?: string;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  status: Project['status'];
  technologies: string[];
  startDate?: string;
  endDate?: string;
  githubUrl?: string;
  liveUrl?: string;
  paperUrl?: string;
  collaborators?: string[];
  priority?: Project['priority'];
  progress?: number;
  enthusiasmLevel?: Project['enthusiasmLevel'];
  mediaCoverage?: Omit<MediaCoverage, '_id'>[];
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  archived?: boolean;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
}

export interface ProjectResponse {
  project: Project;
}