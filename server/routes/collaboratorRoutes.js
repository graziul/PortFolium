const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CollaboratorService = require('../services/collaboratorService');

console.log('CollaboratorRoutes: Module loading...');

// Add middleware to log all requests to this router
router.use((req, res, next) => {
  console.log(`CollaboratorRoutes: Request received - ${req.method} ${req.originalUrl} - Route path: ${req.route?.path || req.url}`);
  console.log('CollaboratorRoutes: Request headers:', req.headers);
  console.log('CollaboratorRoutes: Request body:', req.body);
  next();
});

// Get all collaborators for authenticated user
router.get('/', auth, async (req, res) => {
  console.log('CollaboratorRoutes: GET / - Get collaborators request received');
  console.log('CollaboratorRoutes: User ID:', req.user?.id);

  try {
    const collaborators = await CollaboratorService.getCollaboratorsByUserId(req.user.id);
    console.log('CollaboratorRoutes: Collaborators retrieved:', collaborators.length, 'collaborators');
    res.json({ collaborators });
  } catch (error) {
    console.error('CollaboratorRoutes: Error fetching collaborators:', error);
    res.status(500).json({ error: 'Failed to fetch collaborators' });
  }
});

// Get single collaborator
router.get('/:id', auth, async (req, res) => {
  console.log('CollaboratorRoutes: GET /:id - Get single collaborator request received');
  console.log('CollaboratorRoutes: Collaborator ID:', req.params.id);
  console.log('CollaboratorRoutes: User ID:', req.user?.id);

  try {
    const collaborator = await CollaboratorService.getCollaboratorById(req.params.id, req.user.id);

    if (!collaborator) {
      console.log('CollaboratorRoutes: Collaborator not found');
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    console.log('CollaboratorRoutes: Collaborator retrieved:', collaborator.name);
    res.json({ collaborator });
  } catch (error) {
    console.error('CollaboratorRoutes: Error fetching collaborator:', error);
    res.status(500).json({ error: 'Failed to fetch collaborator' });
  }
});

// Create new collaborator
router.post('/', auth, async (req, res) => {
  console.log('CollaboratorRoutes: POST / - Create collaborator request received');
  console.log('CollaboratorRoutes: User ID:', req.user?.id);
  console.log('CollaboratorRoutes: Collaborator data:', req.body);

  try {
    const collaboratorData = {
      ...req.body,
      userId: req.user.id
    };

    const collaborator = await CollaboratorService.createCollaborator(collaboratorData);
    console.log('CollaboratorRoutes: Collaborator created successfully:', collaborator._id, collaborator.name);

    res.status(201).json({
      collaborator,
      message: 'Collaborator created successfully'
    });
  } catch (error) {
    console.error('CollaboratorRoutes: Error creating collaborator:', error);
    res.status(500).json({ error: 'Failed to create collaborator' });
  }
});

// Update collaborator
router.put('/:id', auth, async (req, res) => {
  console.log('CollaboratorRoutes: PUT /:id - Update collaborator request received');
  console.log('CollaboratorRoutes: Collaborator ID:', req.params.id);
  console.log('CollaboratorRoutes: User ID:', req.user?.id);
  console.log('CollaboratorRoutes: Update data:', req.body);

  try {
    const collaborator = await CollaboratorService.updateCollaborator(req.params.id, req.body, req.user.id);

    if (!collaborator) {
      console.log('CollaboratorRoutes: Collaborator not found for update');
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    console.log('CollaboratorRoutes: Collaborator updated successfully:', collaborator.name);
    res.json({
      collaborator,
      message: 'Collaborator updated successfully'
    });
  } catch (error) {
    console.error('CollaboratorRoutes: Error updating collaborator:', error);
    res.status(500).json({ error: 'Failed to update collaborator' });
  }
});

// Delete collaborator
router.delete('/:id', auth, async (req, res) => {
  console.log('CollaboratorRoutes: DELETE /:id - Delete collaborator request received');
  console.log('CollaboratorRoutes: Collaborator ID:', req.params.id);
  console.log('CollaboratorRoutes: User ID:', req.user?.id);

  try {
    const result = await CollaboratorService.deleteCollaborator(req.params.id, req.user.id);

    if (!result) {
      console.log('CollaboratorRoutes: Collaborator not found for deletion');
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    console.log('CollaboratorRoutes: Collaborator deleted successfully');
    res.json({ message: 'Collaborator deleted successfully' });
  } catch (error) {
    console.error('CollaboratorRoutes: Error deleting collaborator:', error);
    res.status(500).json({ error: 'Failed to delete collaborator' });
  }
});

// Get collaborator statistics
router.get('/stats/summary', auth, async (req, res) => {
  console.log('CollaboratorRoutes: GET /stats/summary - Get collaborator stats request received');
  console.log('CollaboratorRoutes: User ID:', req.user?.id);

  try {
    const stats = await CollaboratorService.getCollaboratorStats(req.user.id);
    console.log('CollaboratorRoutes: Collaborator stats retrieved');
    res.json({ stats });
  } catch (error) {
    console.error('CollaboratorRoutes: Error fetching collaborator stats:', error);
    res.status(500).json({ error: 'Failed to fetch collaborator statistics' });
  }
});

console.log('CollaboratorRoutes: Module loaded successfully');
module.exports = router;