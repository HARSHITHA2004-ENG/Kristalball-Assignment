module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
  
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { role, base_id } = req.user;


    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Access denied: insufficient role permissions",
      });
    }

    if (role === "ADMIN") {
      return next();
    }

    if (req.body.base_id && req.body.base_id !== base_id) {
      return res.status(403).json({
        message: "Access denied: base mismatch",
      });
    }

    if (req.params.base_id && Number(req.params.base_id) !== base_id) {
      return res.status(403).json({
        message: "Access denied: base mismatch",
      });
    }

    next();
  };
};
