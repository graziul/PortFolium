const Collaborator = require('../models/Collaborator');
const mongoose = require('mongoose');

console.log('CollaboratorService: Starting to load CollaboratorService module...');

class CollaboratorService {

  // Get all collaborators for a specific user
  static async getCollaboratorsByUserId(userId) {
    console.log('CollaboratorService: getCollaboratorsByUserId called with userId:', userId);
    try {
      const collaborators = await Collaborator.find({ userId, isActive: true }).sort({ createdAt: -1 });
      console.log('CollaboratorService: Found', collaborators.length, 'collaborators for user:', userId);
      return collaborators;
    } catch (error) {
      console.error('CollaboratorService: Error fetching collaborators by userId:', error);
      throw error;
    }
  }

  // Get a single collaborator by ID
  static async getCollaboratorById(collaboratorId, userId) {
    console.log('CollaboratorService: getCollaboratorById called with collaboratorId:', collaboratorId, 'userId:', userId);
    try {
      const collaborator = await Collaborator.findOne({ _id: collaboratorId, userId });
      if (collaborator) {
        console.log('CollaboratorService: Collaborator found:', collaborator.name);
      } else {
        console.log('CollaboratorService: Collaborator not found');
      }
      return collaborator;
    } catch (error) {
      console.error('CollaboratorService: Error fetching collaborator by ID:', error);
      throw error;
    }
  }

  // Create a new collaborator
  static async createCollaborator(collaboratorData) {
    console.log('CollaboratorService: createCollaborator called with data:', collaboratorData);
    try {
      const collaborator = new Collaborator(collaboratorData);
      const savedCollaborator = await collaborator.save();
      console.log('CollaboratorService: Collaborator created successfully:', savedCollaborator._id, savedCollaborator.name);
      return savedCollaborator;
    } catch (error) {
      console.error('CollaboratorService: Error creating collaborator:', error);
      throw error;
    }
  }

  // Update a collaborator
  static async updateCollaborator(collaboratorId, updateData, userId) {
    console.log('CollaboratorService: updateCollaborator called with collaboratorId:', collaboratorId, 'userId:', userId);
    console.log('CollaboratorService: Update data:', updateData);
    try {
      const collaborator = await Collaborator.findOneAndUpdate(
        { _id: collaboratorId, userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (collaborator) {
        console.log('CollaboratorService: Collaborator updated successfully:', collaborator.name);
      } else {
        console.log('CollaboratorService: Collaborator not found for update');
      }

      return collaborator;
    } catch (error) {
      console.error('CollaboratorService: Error updating collaborator:', error);
      throw error;
    }
  }

  // Delete a collaborator
  static async deleteCollaborator(collaboratorId, userId) {
    console.log('CollaboratorService: deleteCollaborator called with collaboratorId:', collaboratorId, 'userId:', userId);
    try {
      const result = await Collaborator.findOneAndDelete({ _id: collaboratorId, userId });

      if (result) {
        console.log('CollaboratorService: Collaborator deleted successfully:', result.name);
      } else {
        console.log('CollaboratorService: Collaborator not found for deletion');
      }

      return result;
    } catch (error) {
      console.error('CollaboratorService: Error deleting collaborator:', error);
      throw error;
    }
  }

  // Get collaborator statistics by type
  static async getCollaboratorStats(userId) {
    console.log('CollaboratorService: getCollaboratorStats called with userId:', userId);
    try {
      const stats = await Collaborator.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId), isActive: true } },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]);

      console.log('CollaboratorService: Collaborator stats:', stats);
      return stats;
    } catch (error) {
      console.error('CollaboratorService: Error fetching collaborator stats:', error);
      throw error;
    }
  }
}

console.log('CollaboratorService: Class definition complete');
console.log('CollaboratorService: Available methods:', Object.getOwnPropertyNames(CollaboratorService));

module.exports = CollaboratorService;