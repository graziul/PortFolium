const HomeContent = require('../models/HomeContent');

console.log('HomeContentService: Starting to load HomeContentService module...');

class HomeContentService {

  // Get home content for a specific user
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
      console.error('HomeContentService: Error fetching home content by userId:', error);
      throw error;
    }
  }

  // Create or update home content
  static async upsertHomeContent(userId, contentData) {
    console.log('HomeContentService: upsertHomeContent called with userId:', userId);
    console.log('HomeContentService: Content data:', contentData);
    try {
      const homeContent = await HomeContent.findOneAndUpdate(
        { userId },
        { ...contentData, userId },
        { 
          new: true, 
          upsert: true, 
          runValidators: true 
        }
      );
      
      console.log('HomeContentService: Home content upserted successfully for user:', userId);
      return homeContent;
    } catch (error) {
      console.error('HomeContentService: Error upserting home content:', error);
      throw error;
    }
  }

  // Delete home content
  static async deleteHomeContent(userId) {
    console.log('HomeContentService: deleteHomeContent called with userId:', userId);
    try {
      const result = await HomeContent.findOneAndDelete({ userId });

      if (result) {
        console.log('HomeContentService: Home content deleted successfully for user:', userId);
      } else {
        console.log('HomeContentService: No home content found to delete for user:', userId);
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