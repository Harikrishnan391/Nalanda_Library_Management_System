export const verifyAdmin = (role) => {
  try {
    return (req, res, next) => {
      if (!req.userId || req.role !== role) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }
      next();
    };
  } catch (error) {
    console.log(error);
  }
};
