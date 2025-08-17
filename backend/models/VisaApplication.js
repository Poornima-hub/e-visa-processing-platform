const mongoose = require('mongoose');

const visaApplicationSchema = new mongoose.Schema(
    {
        applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        visaType: { type: String, enum: ['T1', 'S1'], required: true },
        status: {
            type: String,
            enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'PENDING_INFO', 'APPROVED', 'REJECTED'],
            default: 'DRAFT'
        },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        passportNo: { type: String, required: true },
        country: { type: String, required: true },
        dob: { type: Date }
    },
    { timestamps: true }
);

module.exports = mongoose.model('VisaApplication', visaApplicationSchema);