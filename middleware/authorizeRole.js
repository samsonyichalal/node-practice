function authorizeRole(requiredRole) {
    return function(req, res, next) {
        if(req.user.role !== requiredRole) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource"
            });
        }
        next();
    };
}

module.exports = authorizeRole;