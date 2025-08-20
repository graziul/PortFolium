const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SkillService = require('../services/skillService');

console.log('SkillRoutes: Module loading...');

// Get skill categories
router.get('/categories', auth, async (req, res) => {
  console.log('SkillRoutes: GET /categories - Get skill categories request received');
  console.log('SkillRoutes: User ID:', req.user?.id);

  try {
    const categories = await SkillService.getSkillCategories();
    console.log('SkillRoutes: Categories retrieved:', categories.length, 'categories');
    res.json({ categories });
  } catch (error) {
    console.error('SkillRoutes: Error fetching skill categories:', error);
    res.status(500).json({ error: 'Failed to fetch skill categories' });
  }
});

// Get all skills for authenticated user
router.get('/', auth, async (req, res) => {
  console.log('SkillRoutes: GET / - Get skills request received');
  console.log('SkillRoutes: User ID:', req.user?.id);

  try {
    const skills = await SkillService.getSkillsByUserId(req.user.id);
    console.log('SkillRoutes: Skills retrieved:', skills.length, 'skills');
    res.json({ skills });
  } catch (error) {
    console.error('SkillRoutes: Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Create new skill
router.post('/', auth, async (req, res) => {
  console.log('SkillRoutes: POST / - Create skill request received');
  console.log('SkillRoutes: User ID:', req.user?.id);
  console.log('SkillRoutes: Skill data:', req.body);

  try {
    const skillData = {
      ...req.body,
      userId: req.user.id
    };

    const skill = await SkillService.createSkill(skillData);
    console.log('SkillRoutes: Skill created successfully:', skill._id, skill.name);

    res.status(201).json({
      skill,
      message: 'Skill created successfully'
    });
  } catch (error) {
    console.error('SkillRoutes: Error creating skill:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// Update skill
router.put('/:id', auth, async (req, res) => {
  console.log('SkillRoutes: PUT /:id - Update skill request received');
  console.log('SkillRoutes: Skill ID:', req.params.id);
  console.log('SkillRoutes: User ID:', req.user?.id);
  console.log('SkillRoutes: Update data:', req.body);

  try {
    const skill = await SkillService.updateSkill(req.params.id, req.body, req.user.id);

    if (!skill) {
      console.log('SkillRoutes: Skill not found for update');
      return res.status(404).json({ error: 'Skill not found' });
    }

    console.log('SkillRoutes: Skill updated successfully:', skill.name);
    res.json({
      skill,
      message: 'Skill updated successfully'
    });
  } catch (error) {
    console.error('SkillRoutes: Error updating skill:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// Delete skill
router.delete('/:id', auth, async (req, res) => {
  console.log('SkillRoutes: DELETE /:id - Delete skill request received');
  console.log('SkillRoutes: Skill ID:', req.params.id);
  console.log('SkillRoutes: User ID:', req.user?.id);

  try {
    const result = await SkillService.deleteSkill(req.params.id, req.user.id);

    if (!result) {
      console.log('SkillRoutes: Skill not found for deletion');
      return res.status(404).json({ error: 'Skill not found' });
    }

    console.log('SkillRoutes: Skill deleted successfully');
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('SkillRoutes: Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

console.log('SkillRoutes: Module loaded successfully');
module.exports = router;