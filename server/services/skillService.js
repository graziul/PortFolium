const Skill = require('../models/Skill');

console.log('SkillService: Starting to load SkillService module...');

class SkillService {
  
  // Get all skills for a specific user
  static async getSkillsByUserId(userId) {
    console.log('SkillService: getSkillsByUserId called with userId:', userId);
    try {
      const skills = await Skill.find({ userId }).sort({ createdAt: -1 });
      console.log('SkillService: Found', skills.length, 'skills for user:', userId);
      return skills;
    } catch (error) {
      console.error('SkillService: Error fetching skills by userId:', error);
      throw error;
    }
  }

  // Get skill categories
  static async getSkillCategories() {
    console.log('SkillService: getSkillCategories called');
    try {
      // Get distinct categories from existing skills
      const categories = await Skill.distinct('category');
      console.log('SkillService: Found categories from database:', categories);
      
      // Default categories if none exist in database
      const defaultCategories = [
        'Programming Languages',
        'Frontend Frameworks',
        'Backend Frameworks',
        'Databases',
        'DevOps & Tools',
        'Design & UI/UX',
        'Mobile Development',
        'Cloud Services'
      ];

      // Combine and deduplicate categories
      const allCategories = [...new Set([...categories, ...defaultCategories])];
      console.log('SkillService: Returning', allCategories.length, 'categories');
      return allCategories;
    } catch (error) {
      console.error('SkillService: Error fetching skill categories:', error);
      throw error;
    }
  }

  // Create a new skill
  static async createSkill(skillData) {
    console.log('SkillService: createSkill called with data:', skillData);
    try {
      const skill = new Skill(skillData);
      const savedSkill = await skill.save();
      console.log('SkillService: Skill created successfully:', savedSkill._id, savedSkill.name);
      return savedSkill;
    } catch (error) {
      console.error('SkillService: Error creating skill:', error);
      throw error;
    }
  }

  // Update a skill
  static async updateSkill(skillId, updateData, userId) {
    console.log('SkillService: updateSkill called with skillId:', skillId, 'userId:', userId);
    console.log('SkillService: Update data:', updateData);
    try {
      const skill = await Skill.findOneAndUpdate(
        { _id: skillId, userId },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (skill) {
        console.log('SkillService: Skill updated successfully:', skill.name);
      } else {
        console.log('SkillService: Skill not found for update');
      }
      
      return skill;
    } catch (error) {
      console.error('SkillService: Error updating skill:', error);
      throw error;
    }
  }

  // Delete a skill
  static async deleteSkill(skillId, userId) {
    console.log('SkillService: deleteSkill called with skillId:', skillId, 'userId:', userId);
    try {
      const result = await Skill.findOneAndDelete({ _id: skillId, userId });
      
      if (result) {
        console.log('SkillService: Skill deleted successfully:', result.name);
      } else {
        console.log('SkillService: Skill not found for deletion');
      }
      
      return result;
    } catch (error) {
      console.error('SkillService: Error deleting skill:', error);
      throw error;
    }
  }

  // Get a single skill by ID
  static async getSkillById(skillId, userId) {
    console.log('SkillService: getSkillById called with skillId:', skillId, 'userId:', userId);
    try {
      const skill = await Skill.findOne({ _id: skillId, userId });
      
      if (skill) {
        console.log('SkillService: Skill found:', skill.name);
      } else {
        console.log('SkillService: Skill not found');
      }
      
      return skill;
    } catch (error) {
      console.error('SkillService: Error fetching skill by ID:', error);
      throw error;
    }
  }
}

console.log('SkillService: Class definition complete');
console.log('SkillService: Available methods:', Object.getOwnPropertyNames(SkillService));
console.log('SkillService: Module export complete');

module.exports = SkillService;