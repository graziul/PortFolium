import api from './api';

export interface Collaborator {
  _id: string;
  name: string;
  type: 'postdoc' | 'junior_faculty' | 'senior_faculty' | 'industry_tech' | 'industry_finance' | 'industry_healthcare' | 'undergraduate' | 'graduate' | 'professional_ethicist' | 'journalist';
  institution?: string;
  role?: string;
  projects: string[];
  avatar?: string;
  sector?: string;
}

// Description: Get all collaborators
// Endpoint: GET /api/collaborators
// Request: {}
// Response: { collaborators: Collaborator[] }
export const getCollaborators = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        collaborators: [
          {
            _id: '1',
            name: 'Dr. Sarah Chen',
            type: 'senior_faculty',
            institution: 'Stanford University',
            role: 'Professor of Computer Science',
            projects: ['1', '3'],
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
          },
          {
            _id: '2',
            name: 'Dr. James Park',
            type: 'postdoc',
            institution: 'MIT',
            role: 'Postdoctoral Researcher',
            projects: ['2'],
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
          },
          {
            _id: '3',
            name: 'Dr. Lisa Wang',
            type: 'junior_faculty',
            institution: 'UC Berkeley',
            role: 'Assistant Professor',
            projects: ['4'],
            avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100'
          },
          {
            _id: '4',
            name: 'Michael Rodriguez',
            type: 'industry_tech',
            institution: 'Google Research',
            role: 'Senior Research Scientist',
            sector: 'Technology',
            projects: ['2', '4'],
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
          },
          {
            _id: '5',
            name: 'David Kim',
            type: 'industry_finance',
            institution: 'Goldman Sachs',
            role: 'Quantitative Researcher',
            sector: 'Finance',
            projects: ['3'],
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
          },
          {
            _id: '6',
            name: 'Dr. Maria Garcia',
            type: 'industry_healthcare',
            institution: 'Johnson & Johnson',
            role: 'Principal Data Scientist',
            sector: 'Healthcare',
            projects: ['1'],
            avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100'
          },
          {
            _id: '7',
            name: 'Emily Johnson',
            type: 'graduate',
            institution: 'MIT',
            role: 'PhD Candidate',
            projects: ['1', '5'],
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
          },
          {
            _id: '8',
            name: 'Alex Thompson',
            type: 'undergraduate',
            institution: 'Carnegie Mellon',
            role: 'Computer Science Student',
            projects: ['4'],
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
          },
          {
            _id: '9',
            name: 'Robert Chen',
            type: 'graduate',
            institution: 'Stanford',
            role: 'Master\'s Student',
            projects: ['2', '3'],
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100'
          },
          {
            _id: '10',
            name: 'Dr. Jennifer Adams',
            type: 'professional_ethicist',
            institution: 'Ethics Institute',
            role: 'Technology Ethics Consultant',
            projects: ['1', '3'],
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
          },
          {
            _id: '11',
            name: 'Mark Williams',
            type: 'journalist',
            institution: 'Tech Today Magazine',
            role: 'Science & Technology Journalist',
            projects: ['2'],
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/collaborators');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
};