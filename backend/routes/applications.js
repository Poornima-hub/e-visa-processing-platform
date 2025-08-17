// /backend/routes/applications.js
const express = require('express');
const {
    getApplications,
    addApplication,
    getApplication,
    updateApplication,
    deleteApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// /api/applications
router
    .route('/')
    .get(protect, getApplications)   // list current user's applications
    .post(protect, addApplication);  // create new application

// /api/applications/:id
router
    .route('/:id')
    .get(protect, getApplication)    // get one application (owned by user)
    .put(protect, updateApplication) // update application
    .delete(protect, deleteApplication); // delete application

module.exports = router;
