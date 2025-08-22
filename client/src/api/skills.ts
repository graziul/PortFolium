import api from './api';

export interface Skill {
  _id: string;
  name: string;
  category: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  userId: string;
  projects: string[];
  description?: string;
  relatedSkills?: string[];
  certifications?: string[];
  lastUsed?: string;
  featured?: boolean;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

// Description: Get all skills for the authenticated user
// Endpoint: GET /api/skills
// Request: {}
// Response: { skills: Skill[] }
export const getSkills = async () => {
  try {
    console.log('Skills API: Fetching all skills...');
    const response = await api.get('/api/skills');
    console.log('Skills API: Skills fetched successfully:', response.data.skills?.length || 0);
    return response.data;
  } catch (error) {
    console.error('Skills API: Error fetching skills:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get featured skills for home page
// Endpoint: GET /api/skills/featured
// Request: {}
// Response: { skills: Skill[] }
export const getFeaturedSkills = async () => {
  try {
    console.log('Skills API: Fetching featured skills...');
    const response = await api.get('/api/skills/featured');
    console.log('Skills API: Featured skills fetched successfully:', response.data.skills?.length || 0);
    return response.data;
  } catch (error) {
    console.error('Skills API: Error fetching featured skills:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all skill categories
// Endpoint: GET /api/skills/categories
// Request: {}
// Response: { categories: string[] }
export const getSkillCategories = async () => {
  try {
    console.log('Skills API: Fetching skill categories...');
    const response = await api.get('/api/skills/categories');
    console.log('Skills API: Categories fetched successfully:', response.data.categories?.length || 0);
    return response.data;
  } catch (error) {
    console.error('Skills API: Error fetching categories:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new skill
// Endpoint: POST /api/skills
// Request: { name: string, category: string, experienceLevel: string, yearsOfExperience: number, description?: string, relatedSkills?: string[], certifications?: string[], featured?: boolean, displayOrder?: number }
// Response: { skill: Skill, message: string }
export const createSkill = async (skillData: Partial<Skill>) => {
  try {
    console.log('Skills API: Creating new skill:', skillData.name);
    const response = await api.post('/api/skills', skillData);
    console.log('Skills API: Skill created successfully:', response.data.skill?._id);
    return response.data;
  } catch (error) {
    console.error('Skills API: Error creating skill:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update an existing skill
// Endpoint: PUT /api/skills/:id
// Request: { name?: string, category?: string, experienceLevel?: string, yearsOfExperience?: number, description?: string, relatedSkills?: string[], certifications?: string[], featured?: boolean, displayOrder?: number }
// Response: { skill: Skill, message: string }
export const updateSkill = async (id: string, skillData: Partial<Skill>) => {
  try {
    console.log('Skills API: Updating skill:', id, skillData);
    const response = await api.put(`/api/skills/${id}`, skillData);
    console.log('Skills API: Skill updated successfully:', response.data.skill?.name);
    return response.data;
  } catch (error) {
    console.error('Skills API: Error updating skill:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a skill
// Endpoint: DELETE /api/skills/:id
// Request: {}
// Response: { message: string }
export const deleteSkill = async (id: string) => {
  try {
    console.log('Skills API: Deleting skill:', id);
    const response = await api.delete(`/api/skills/${id}`);
    console.log('Skills API: Skill deleted successfully');
    return response.data;
  } catch (error) {
    console.error('Skills API: Error deleting skill:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};