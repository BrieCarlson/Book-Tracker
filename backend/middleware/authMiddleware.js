const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Not authorized.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select(
      "+tokenVersion"
    );

    if (!user) {
      return res.status(401).json({
        message: "Not authorized.",
      });
    }

    const currentTokenVersion = user.tokenVersion || 0;

    if (decoded.tokenVersion !== currentTokenVersion) {
      return res.status(401).json({
        message: "Session expired. Please log in again.",
      });
    }

    req.user = {
      id: user._id.toString(),
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Not authorized.",
    });
  }
}

module.exports = protect;