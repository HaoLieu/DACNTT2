module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            status: false,
            message: "You must be logged in to access this resource."
        });
    }
    next();  // Proceed to the next middleware/route handler if the user is authenticated
};
