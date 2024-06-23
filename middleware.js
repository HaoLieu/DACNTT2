const permissions = require('./permissions');
const User = require('./models/user');

function checkPermissions(resource, action) {
    return async (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          message: "You must be logged in to access this resource."
        });
      }
  
      try {
        const user = await User.findById(req.user._id).populate('role');
        if (!user || !user.role) {
          return res.status(403).json({
            message: "User role not found."
          });
        }
  
        // Retrieve the specific permission required for the resource and action.
        const requiredPermission = permissions[resource][action];
        
        // Check if the user's role permissions include this specific permission.
        const hasPermission = user.role.permissions[resource] && user.role.permissions[resource].includes(action);
        if (!hasPermission) {
          return res.status(403).json({
            message: "Access denied. Insufficient permissions."
          });
        }
  
        next();
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
  }
  
  function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "You must be logged in to access this resource."
      });
    }
    next();
  }
  
  module.exports = {
    checkPermissions,
    isLoggedIn
  };