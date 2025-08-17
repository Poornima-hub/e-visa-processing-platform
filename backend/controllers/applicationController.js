const VisaApplication = require('../models/VisaApplication');

// GET /api/applications
const getApplications = async (req, res) => {
    try {
        const apps = await VisaApplication.find({ applicantId: req.user.id }).sort({ createdAt: -1 });
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/applications
const addApplication = async (req, res) => {
    const { visaType, firstName, lastName, passportNo, country, dob } = req.body;
    try {
        const app = await VisaApplication.create({
            applicantId: req.user.id,
            visaType, firstName, lastName, passportNo, country, dob
        });
        res.status(201).json(app);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/applications/:id
const getApplication = async (req, res) => {
    try {
        const app = await VisaApplication.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        if (app.applicantId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
        res.json(app);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/applications/:id
const updateApplication = async (req, res) => {
    const { visaType, firstName, lastName, passportNo, country, dob, status } = req.body;
    try {
        const app = await VisaApplication.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        if (app.applicantId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

        if (visaType) app.visaType = visaType;
        if (firstName) app.firstName = firstName;
        if (lastName) app.lastName = lastName;
        if (passportNo) app.passportNo = passportNo;
        if (country) app.country = country;
        if (dob) app.dob = dob;
        if (status) app.status = status; // optional for simple CRUD

        const updated = await app.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/applications/:id
const deleteApplication = async (req, res) => {
    try {
        const app = await VisaApplication.findById(req.params.id);
        if (!app) return res.status(404).json({ message: 'Application not found' });
        if (app.applicantId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
        await app.deleteOne();
        res.json({ message: 'Application deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getApplications, addApplication, getApplication, updateApplication, deleteApplication };