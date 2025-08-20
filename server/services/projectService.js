console.log('ProjectService: Starting to load ProjectService module...');

try {
  const Project = require('../models/Project');
  console.log('ProjectService: Project model loaded successfully');
} catch (error) {
  console.error('ProjectService: CRITICAL ERROR - Failed to load Project model:', error);
  console.error('ProjectService: Error stack:', error.stack);
}

const Project = require('../models/Project');

console.log('ProjectService: Starting to load ProjectService module...');

class ProjectService {

  // Get all projects for a specific user
  static async getProjectsByUserId(userId) {
    console.log('ProjectService: getProjectsByUserId called with userId:', userId);
    try {
      const projects = await Project.find({ userId }).sort({ order: 1, createdAt: -1 });
      console.log('ProjectService: Found projects count:', projects.length);
      return projects;
    } catch (error) {
      console.error('ProjectService: Error fetching projects by userId:', error);
      throw error;
    }
  }

  // Get a single project by ID
  static async getProjectById(projectId, userId) {
    console.log('ProjectService: getProjectById called with projectId:', projectId, 'userId:', userId);
    try {
      const project = await Project.findOne({ _id: projectId, userId });
      if (project) {
        console.log('ProjectService: Project found:', project.title);
      } else {
        console.log('ProjectService: Project not found');
      }
      return project;
    } catch (error) {
      console.error('ProjectService: Error fetching project by ID:', error);
      throw error;
    }
  }

  // Create a new project
  static async createProject(projectData) {
    console.log('ProjectService: createProject called with data:', projectData);
    try {
      const project = new Project(projectData);
      const savedProject = await project.save();
      console.log('ProjectService: Project created successfully:', savedProject._id, savedProject.title);
      return savedProject;
    } catch (error) {
      console.error('ProjectService: Error creating project:', error);
      throw error;
    }
  }

  // Update a project
  static async updateProject(projectId, updateData, userId) {
    console.log('ProjectService: updateProject called with projectId:', projectId, 'userId:', userId);
    console.log('ProjectService: Update data:', updateData);
    try {
      console.log('ProjectService: Updating project:', projectId, 'for user:', userId);
      const project = await Project.findOneAndUpdate(
        { _id: projectId, userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (project) {
        console.log('ProjectService: Project updated successfully:', project.title);
      } else {
        console.log('ProjectService: Project not found for update');
      }

      return project;
    } catch (error) {
      console.error('ProjectService: Error updating project:', error);
      throw error;
    }
  }

  // Update projects order
  static async updateProjectsOrder(projectIds, userId) {
    console.log('ProjectService: updateProjectsOrder called with projectIds:', projectIds, 'userId:', userId);
    try {
      // Update each project's order based on its position in the array
      const updatePromises = projectIds.map((projectId, index) => {
        console.log('ProjectService: Updating project order - ID:', projectId, 'Order:', index);
        return Project.findOneAndUpdate(
          { _id: projectId, userId },
          { order: index },
          { new: true }
        );
      });

      const results = await Promise.all(updatePromises);
      console.log('ProjectService: Projects order updated successfully, count:', results.length);
      return results;
    } catch (error) {
      console.error('ProjectService: Error updating projects order:', error);
      throw error;
    }
  }

  // Delete a project
  static async deleteProject(projectId, userId) {
    console.log('ProjectService: deleteProject called with projectId:', projectId, 'userId:', userId);
    try {
      const result = await Project.findOneAndDelete({ _id: projectId, userId });

      if (result) {
        console.log('ProjectService: Project deleted successfully:', result.title);
      } else {
        console.log('ProjectService: Project not found for deletion');
      }

      return result;
    } catch (error) {
      console.error('ProjectService: Error deleting project:', error);
      throw error;
    }
  }
}

console.log('ProjectService: Class definition complete');
console.log('ProjectService: Available methods:', Object.getOwnPropertyNames(ProjectService));

module.exports = ProjectService;