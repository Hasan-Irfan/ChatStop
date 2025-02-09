export const adminChecker = (req, res, next) => {
    const userRole = req.user.role; // Assuming req.user contains the authenticated user's information

    if (!userRole) {
        return res.status(401).json({success:false , message: 'Unauthorized. Please log in.' });
    }

    if (userRole && userRole === "admin") {
        next(); // User is admin, proceed to the next middleware or route handler
    } else {
        res.status(403).json({success:false , message: 'Access denied. Admins only.' });
    }
};
