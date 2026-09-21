const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { rateLimit } = require("express-rate-limit");

const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const {
  clearAuthCookies,
  setAuthCookies,
} = require("../utils/authCookie");

const router = express.Router();

const PASSWORD_MIN_LENGTH = 12;

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many registration attempts. Please try again later.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Too many login attempts. Please try again later.",
  },
});

const emailChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

function normalizeEmail(value) {
  return typeof value === "string"
    ? value.trim().toLowerCase()
    : "";
}

function isValidEmail(email) {
  return (
    email.length <= 254 &&
    validator.isEmail(email, {
      allow_utf8_local_part: true,
    })
  );
}

function getPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

function createAuthToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      tokenVersion: user.tokenVersion || 0,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function handleServerError(res, error) {
  if (error?.code === 11000) {
    return res.status(409).json({
      message: "That email address is already in use.",
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Something went wrong. Please try again later.",
  });
}

router.post("/register", registerLimiter, async (req, res) => {
  try {
    const {
      name,
      email: rawEmail,
      password,
    } = req.body || {};

    const cleanName =
      typeof name === "string" ? name.trim() : "";
    const email = normalizeEmail(rawEmail);

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({
        message: "Name must be between 2 and 80 characters.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (
      typeof password !== "string" ||
      password.length < PASSWORD_MIN_LENGTH
    ) {
      return res.status(400).json({
        message:
          "Password must be at least " +
          PASSWORD_MIN_LENGTH +
          " characters.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: cleanName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      user: getPublicUser(user),
    });
  } catch (error) {
    return handleServerError(res, error);
  }
});

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const {
      email: rawEmail,
      password,
      rememberMe,
    } = req.body || {};

    const email = normalizeEmail(rawEmail);

    const user = await User.findOne({ email }).select(
      "+password +tokenVersion"
    );

    if (!user || typeof password !== "string") {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    setAuthCookies(
      res,
      createAuthToken(user),
      rememberMe !== false
    );

    return res.json({
      user: getPublicUser(user),
    });
  } catch (error) {
    return handleServerError(res, error);
  }
});

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.json({
      user: getPublicUser(user),
    });
  } catch (error) {
    return handleServerError(res, error);
  }
});

router.post("/logout", (req, res) => {
  clearAuthCookies(res);

  return res.json({
    message: "Logged out successfully.",
  });
});

router.patch("/profile", protect, async (req, res) => {
  try {
    const { name } = req.body || {};
    const cleanName =
      typeof name === "string" ? name.trim() : "";

    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({
        message: "Name must be between 2 and 80 characters.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    user.name = cleanName;
    await user.save();

    return res.json({
      message: "Profile updated successfully.",
      user: getPublicUser(user),
    });
  } catch (error) {
    return handleServerError(res, error);
  }
});

router.post(
  "/profile/email-change",
  emailChangeLimiter,
  protect,
  async (req, res) => {
    try {
      const {
        newEmail: rawNewEmail,
        currentPassword,
      } = req.body || {};

      const newEmail = normalizeEmail(rawNewEmail);

      if (!isValidEmail(newEmail)) {
        return res.status(400).json({
          message: "Please enter a valid new email address.",
        });
      }

      if (
        typeof currentPassword !== "string" ||
        currentPassword.length === 0
      ) {
        return res.status(400).json({
          message: "Your current password is required.",
        });
      }

      const user = await User.findById(req.user.id).select(
        "+password"
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      const passwordMatches = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!passwordMatches) {
        return res.status(401).json({
          message: "Your current password is incorrect.",
        });
      }

      if (newEmail === user.email) {
        return res.status(400).json({
          message: "That is already your current email address.",
        });
      }

      const existingUser = await User.findOne({
        email: newEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "That email address is already in use.",
        });
      }

      user.email = newEmail;
      user.tokenVersion = (user.tokenVersion || 0) + 1;

      await user.save();

      return res.json({
        message:
          "Email updated successfully. Please sign in again.",
        user: getPublicUser(user),
      });
    } catch (error) {
      return handleServerError(res, error);
    }
  }
);

router.post(
  "/profile/password",
  passwordChangeLimiter,
  protect,
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body || {};

      if (
        typeof currentPassword !== "string" ||
        currentPassword.length === 0
      ) {
        return res.status(400).json({
          message: "Your current password is required.",
        });
      }

      if (
        typeof newPassword !== "string" ||
        newPassword.length < PASSWORD_MIN_LENGTH
      ) {
        return res.status(400).json({
          message:
            "New password must be at least " +
            PASSWORD_MIN_LENGTH +
            " characters.",
        });
      }

      const user = await User.findById(req.user.id).select(
        "+password +tokenVersion"
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      const currentPasswordMatches = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!currentPasswordMatches) {
        return res.status(401).json({
          message: "Your current password is incorrect.",
        });
      }

      if (currentPassword === newPassword) {
        return res.status(400).json({
          message:
            "Your new password must be different from your current password.",
        });
      }

      user.password = await bcrypt.hash(newPassword, 12);
      user.tokenVersion = (user.tokenVersion || 0) + 1;

      await user.save();

      return res.json({
        message:
          "Password changed successfully. Please sign in again.",
      });
    } catch (error) {
      return handleServerError(res, error);
    }
  }
);

module.exports = router;
