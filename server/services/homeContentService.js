const HomeContent = require('../models/HomeContent');

console.log('HomeContentService: Starting to load HomeContentService module...');

class HomeContentService {
  
  // Get home content by user ID
  static async getHomeContentByUserId(userId) {
    console.log('HomeContentService: getHomeContentByUserId called with userId:', userId);
    try {
      const homeContent = await HomeContent.findOne({ userId });
      if (homeContent) {
        console.log('HomeContentService: Home content found for user:', userId);
      } else {
        console.log('HomeContentService: No home content found for user:', userId);
      }
      return homeContent;
    } catch (error) {
      console.error('HomeContentService: Error fetching home content:', error);
      throw error;
    }
  }

  // Create or update home content
  static async createOrUpdateHomeContent(userId, homeContentData) {
    console.log('HomeContentService: createOrUpdateHomeContent called with userId:', userId);
    console.log('HomeContentService: Home content data:', homeContentData);
    try {
      const homeContent = await HomeContent.findOneAndUpdate(
        { userId },
        homeContentData,
        { new: true, upsert: true, runValidators: true }
      );
      console.log('HomeContentService: Home content created/updated successfully');
      return homeContent;
    } catch (error) {
      console.error('HomeContentService: Error creating/updating home content:', error);
      throw error;
    }
  }

  // Delete home content
  static async deleteHomeContent(userId) {
    console.log('HomeContentService: deleteHomeContent called with userId:', userId);
    try {
      const result = await HomeContent.findOneAndDelete({ userId });
      if (result) {
        console.log('HomeContentService: Home content deleted successfully');
      } else {
        console.log('HomeContentService: No home content found to delete');
      }
      return result;
    } catch (error) {
      console.error('HomeContentService: Error deleting home content:', error);
      throw error;
    }
  }
}

console.log('HomeContentService: Class definition complete');
console.log('HomeContentService: Available methods:', Object.getOwnPropertyNames(HomeContentService));

module.exports = HomeContentService;