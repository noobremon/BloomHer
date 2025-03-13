import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const menstrualCycleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    symptoms: {
        type: [String],
    },
    notes: {
        type: String,
    },
});

const pcosDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    diagnosisDate: {
        type: Date,
        required: true,
    },
    symptoms: {
        type: [String],
    },
    treatment: {
        type: String,
    },
});

const User = mongoose.model('User', userSchema);
const MenstrualCycle = mongoose.model('MenstrualCycle', menstrualCycleSchema);
const PCOSData = mongoose.model('PCOSData', pcosDataSchema);

export { User, MenstrualCycle, PCOSData };