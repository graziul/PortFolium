import api from './api';

export interface Skill {
  _id: string;
  name: string;
  category: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  userId: string;
  projects: string[];
  createdAt: string;
  updatedAt: string;
}

// Description: Get all skills for the authenticated user
// Endpoint: GET /api/skills
// Request: {}
// Response: { skills: Skill[] }
export const getSkills = async () => {
  console.log('SkillsAPI: getSkills called');

  try {
    const response = await api.get('/api/skills');
    console.log('SkillsAPI: getSkills response:', response.data);
    return response.data;
  } catch (error) {
    console.error('SkillsAPI: getSkills error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get all skill categories
// Endpoint: GET /api/skills/categories
// Request: {}
// Response: { categories: string[] }
export const getSkillCategories = async () => {
  console.log('SkillsAPI: getSkillCategories called');

  try {
    const response = await api.get('/api/skills/categories');
    console.log('SkillsAPI: getSkillCategories response:', response.data);
    return response.data;
  } catch (error) {
    console.error('SkillsAPI: getSkillCategories error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Create a new skill
// Endpoint: POST /api/skills
// Request: { name: string, category: string, experienceLevel: string, yearsOfExperience: number }
// Response: { skill: Skill, message: string }
export const createSkill = async (skillData: Omit<Skill, '_id' | 'userId' | 'projects' | 'createdAt' | 'updatedAt'>) => {
  console.log('SkillsAPI: createSkill called with data:', skillData);

  try {
    const response = await api.post('/api/skills', skillData);
    console.log('SkillsAPI: createSkill response:', response.data);
    return response.data;
  } catch (error) {
    console.error('SkillsAPI: createSkill error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Update an existing skill
// Endpoint: PUT /api/skills/:id
// Request: { name?: string, category?: string, experienceLevel?: string, yearsOfExperience?: number }
// Response: { skill: Skill, message: string }
export const updateSkill = async (id: string, skillData: Partial<Omit<Skill, '_id' | 'userId' | 'projects' | 'createdAt' | 'updatedAt'>>) => {
  console.log('SkillsAPI: updateSkill called with id:', id, 'data:', skillData);

  try {
    const response = await api.put(`/api/skills/${id}`, skillData);
    console.log('SkillsAPI: updateSkill response:', response.data);
    return response.data;
  } catch (error) {
    console.error('SkillsAPI: updateSkill error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Delete a skill
// Endpoint: DELETE /api/skills/:id
// Request: {}
// Response: { message: string }
export const deleteSkill = async (id: string) => {
  console.log('SkillsAPI: deleteSkill called with id:', id);

  try {
    const response = await api.delete(`/api/skills/${id}`);
    console.log('SkillsAPI: deleteSkill response:', response.data);
    return response.data;
  } catch (error) {
    console.error('SkillsAPI: deleteSkill error:', error);
    throw new Error(error?.response?.data?.error || error.message);
  }
};