module.exports = function (req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(400).json({
      status: "error",
      message: "You do not have permission",
    });
  }

  next();
};
