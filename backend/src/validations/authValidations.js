import Joi from "joi";

// Login validation schema
export const loginValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty"
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty"
    })
});

// Signup validation schema
export const signupValidation = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.alphanum": "Username must contain only alphanumeric characters",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username cannot exceed 30 characters",
      "any.required": "Username is required",
      "string.empty": "Username cannot be empty"
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty"
    }),
  password: Joi.string()
    .min(6)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password cannot exceed 128 characters",
      "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty"
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords must match",
      "any.required": "Password confirmation is required"
    })
});

// Email verification validation schema
export const emailVerificationValidation = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      "any.required": "Verification token is required",
      "string.empty": "Verification token cannot be empty"
    })
});

// Refresh token validation schema
export const refreshTokenValidation = Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      "any.required": "Refresh token is required",
      "string.empty": "Refresh token cannot be empty"
    })
});

// Reset password email validation schema
export const resetPasswordEmailValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty"
    })
});

// Update password validation schema
export const updatePasswordValidation = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      "any.required": "Reset token is required",
      "string.empty": "Reset token cannot be empty"
    }),
  password: Joi.string()
    .min(6)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password cannot exceed 128 characters",
      "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, and one number",
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty"
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords must match",
      "any.required": "Password confirmation is required"
    })
});

// Logout validation schema
export const logoutValidation = Joi.object({
  userId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": "User ID must be a valid hexadecimal string",
      "string.length": "User ID must be exactly 24 characters long",
      "any.required": "User ID is required"
    })
});

// Validation middleware function
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(", ");
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorMessage
      });
    }
    
    next();
  };
};
