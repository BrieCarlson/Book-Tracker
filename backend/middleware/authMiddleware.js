const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  getAuthToken,
  hasValidCsrfToken,
} = require("../utils/authCookie");

async function protect(req, res, next) {
  const token = getAuthToken(req);

  if (!token) {
    return res.status(401).json({
      message: "Not authorized.",
    });
  }

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

    if (!hasValidCsrfToken(req)) {
      return res.status(403).json({
        message: "Invalid security token. Please refresh and try again.",
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
