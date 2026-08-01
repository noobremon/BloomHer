const { registerUser, loginUser, getUserData } = require('./userController');
const { trackMenstrualCycle } = require('./menstrualController');
const { managePCOS } = require('./pcosController');

module.exports = {
    registerUser,
    loginUser,
    getUserData,
    trackMenstrualCycle,
    managePCOS
};