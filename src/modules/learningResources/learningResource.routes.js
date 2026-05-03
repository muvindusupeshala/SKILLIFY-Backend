const express = require('express');
const { authMiddleware, requireAdmin } = require('../../middleware/auth.middleware');
const { listResources, getRecommendedResources, createResource, updateResource, deleteResource, updateResourceProgress } = require('./learningResource.controller');

const router = express.Router();

router.use(authMiddleware);
router.get('/', listResources);
router.get('/recommended', getRecommendedResources);
router.post('/', requireAdmin, createResource);
router.put('/:id', requireAdmin, updateResource);
router.delete('/:id', requireAdmin, deleteResource);
router.patch('/:resourceId/progress', updateResourceProgress);

module.exports = router;
