const express = require('express');
const { authMiddleware, requireAdmin } = require('../../middleware/auth.middleware');
const { listCareerPaths, getCareerPath, createCareerPath, updateCareerPath, deleteCareerPath } = require('./careerPath.controller');

const router = express.Router();

router.use(authMiddleware);
router.get('/', listCareerPaths);
router.post('/', requireAdmin, createCareerPath);
router.get('/:id', getCareerPath);
router.put('/:id', requireAdmin, updateCareerPath);
router.delete('/:id', requireAdmin, deleteCareerPath);

module.exports = router;
