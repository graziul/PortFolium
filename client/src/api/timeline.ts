import api from './api';

export interface TimelineEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  type: 'project' | 'experience' | 'education' | 'milestone';
  category: string;
  metadata?: {
    projectId?: string;
    experienceId?: string;
    educationId?: string;
    status?: string;
    technologies?: string[];
    achievements?: string[];
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimelineEventData {
  title: string;
  description: string;
  date: string;
  type: 'project' | 'experience' | 'education' | 'milestone';
  category: string;
  metadata?: {
    projectId?: string;
    experienceId?: string;
    educationId?: string;
    status?: string;
    technologies?: string[];
    achievements?: string[];
  };
}

export interface UpdateTimelineEventData extends Partial<CreateTimelineEventData> {}

// Description: Get all timeline events for the current user
// Endpoint: GET /api/timeline
// Request: {}
// Response: { events: TimelineEvent[] }
export const getTimelineEvents = async (): Promise<{ events: TimelineEvent[] }> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        events: [
          {
            _id: '1',
            title: 'Started React Portfolio Project',
            description: 'Began development of a personal portfolio website using React and TypeScript',
            date: '2024-01-15T00:00:00Z',
            type: 'project',
            category: 'Web Development',
            metadata: {
              projectId: 'proj1',
              status: 'in-progress',
              technologies: ['React', 'TypeScript', 'Tailwind CSS']
            },
            userId: 'user123',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            _id: '2',
            title: 'Completed Frontend Developer Certification',
            description: 'Successfully completed advanced frontend development certification program',
            date: '2024-01-10T00:00:00Z',
            type: 'milestone',
            category: 'Professional Development',
            metadata: {
              achievements: ['React Mastery', 'TypeScript Proficiency', 'UI/UX Design Principles']
            },
            userId: 'user123',
            createdAt: '2024-01-10T14:30:00Z',
            updatedAt: '2024-01-10T14:30:00Z'
          },
          {
            _id: '3',
            title: 'Joined TechCorp as Senior Developer',
            description: 'Started new role focusing on full-stack web development and team leadership',
            date: '2023-12-01T00:00:00Z',
            type: 'experience',
            category: 'Career',
            metadata: {
              experienceId: 'exp1',
              status: 'current'
            },
            userId: 'user123',
            createdAt: '2023-12-01T09:00:00Z',
            updatedAt: '2023-12-01T09:00:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/timeline');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Create a new timeline event
// Endpoint: POST /api/timeline
// Request: CreateTimelineEventData
// Response: TimelineEvent
export const createTimelineEvent = async (eventData: CreateTimelineEventData): Promise<TimelineEvent> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: Date.now().toString(),
        ...eventData,
        userId: 'user123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/timeline', eventData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Update an existing timeline event
// Endpoint: PUT /api/timeline/:id
// Request: UpdateTimelineEventData
// Response: TimelineEvent
export const updateTimelineEvent = async (id: string, eventData: UpdateTimelineEventData): Promise<TimelineEvent> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: id,
        title: eventData.title || 'Updated Event',
        description: eventData.description || 'Updated description',
        date: eventData.date || new Date().toISOString(),
        type: eventData.type || 'milestone',
        category: eventData.category || 'General',
        metadata: eventData.metadata || {},
        userId: 'user123',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: new Date().toISOString()
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/timeline/${id}`, eventData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};

// Description: Delete a timeline event
// Endpoint: DELETE /api/timeline/:id
// Request: {}
// Response: { message: string }
export const deleteTimelineEvent = async (id: string): Promise<{ message: string }> => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Timeline event deleted successfully' });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/timeline/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};