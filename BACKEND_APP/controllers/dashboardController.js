// controllers/dashboardController.js

const authService = require('../services/authService');

exports.getDashboard = async (req, res) => {
  const { userId } = req.user; // Assuming you're using JWT and storing userId in req.user

  const userProfile = await authService.getUserProfile(userId);
  
  if (userProfile.status !== 200) {
    return res.status(userProfile.status).json(userProfile.data);
  }

  res.status(200).json({
    message: 'success',
    profile: userProfile.data.profile
  });
};
