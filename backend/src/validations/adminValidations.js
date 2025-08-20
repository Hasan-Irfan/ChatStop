import Joi from "joi";

// List users validation schema
export const listUsersValidation = Joi.object({
  search: Joi.string()
    .max(100)
    .optional()
    .messages({
      "string.max": "Search query cannot exceed 100 characters"
    }),
  role: Joi.string()
    .valid("admin", "user", "visitor")
    .optional()
    .messages({
      "any.only": "Role must be one of: admin, user, visitor"
    }),
  status: Joi.string()
    .valid("active", "suspended")
    .optional()
    .messages({
      "any.only": "Status must be either 'active' or 'suspended'"
    }),
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1)
    .messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be an integer",
      "number.min": "Page must be at least 1"
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(10)
    .messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit cannot exceed 100"
    })
});

// Update user role validation schema
export const updateUserRoleValidation = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": "User ID must be a valid hexadecimal string",
      "string.length": "User ID must be exactly 24 characters long",
      "any.required": "User ID is required"
    }),
  role: Joi.string()
    .valid("admin", "user", "visitor")
    .required()
    .messages({
      "any.only": "Role must be one of: admin, user, visitor",
      "any.required": "Role is required"
    })
});

// Suspend user validation schema
export const suspendUserValidation = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": "User ID must be a valid hexadecimal string",
      "string.length": "User ID must be exactly 24 characters long",
      "any.required": "User ID is required"
    }),
  reason: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      "string.min": "Suspension reason must be at least 10 characters long",
      "string.max": "Suspension reason cannot exceed 500 characters",
      "any.required": "Suspension reason is required",
      "string.empty": "Suspension reason cannot be empty"
    })
});

// Reactivate user validation schema
export const reactivateUserValidation = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.hex": "User ID must be a valid hexadecimal string",
      "string.length": "User ID must be exactly 24 characters long",
      "any.required": "User ID is required"
    })
});

// List audit logs validation schema
export const listAuditLogsValidation = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .default(1)
    .messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be an integer",
      "number.min": "Page must be at least 1"
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(20)
    .messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit cannot exceed 100"
    }),
  action: Joi.string()
    .max(50)
    .optional()
    .messages({
      "string.max": "Action filter cannot exceed 50 characters"
    }),
  actor: Joi.string()
    .max(50)
    .optional()
    .messages({
      "string.max": "Actor filter cannot exceed 50 characters"
    }),
  target: Joi.string()
    .hex()
    .length(24)
    .optional()
    .messages({
      "string.hex": "Target user ID must be a valid hexadecimal string",
      "string.length": "Target user ID must be exactly 24 characters long"
    })
});

// Bulk operations validation schema
export const bulkOperationValidation = Joi.object({
  userIds: Joi.array()
    .items(
      Joi.string()
        .hex()
        .length(24)
        .messages({
          "string.hex": "User ID must be a valid hexadecimal string",
          "string.length": "User ID must be exactly 24 characters long"
        })
    )
    .min(1)
    .max(100)
    .required()
    .messages({
      "array.min": "At least one user ID is required",
      "array.max": "Cannot process more than 100 users at once",
      "any.required": "User IDs array is required"
    }),
  operation: Joi.string()
    .valid("suspend", "reactivate", "delete", "changeRole")
    .required()
    .messages({
      "any.only": "Operation must be one of: suspend, reactivate, delete, changeRole",
      "any.required": "Operation type is required"
    }),
  reason: Joi.string()
    .when("operation", {
      is: "suspend",
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .min(10)
    .max(500)
    .messages({
      "string.min": "Reason must be at least 10 characters long",
      "string.max": "Reason cannot exceed 500 characters",
      "any.required": "Reason is required for suspension operations"
    }),
  newRole: Joi.string()
    .valid("admin", "user", "visitor")
    .when("operation", {
      is: "changeRole",
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .messages({
      "any.only": "New role must be one of: admin, user, visitor",
      "any.required": "New role is required for role change operations"
    })
});

// Search and filter validation schema
export const searchFilterValidation = Joi.object({
  query: Joi.string()
    .max(200)
    .optional()
    .messages({
      "string.max": "Search query cannot exceed 200 characters"
    }),
  filters: Joi.object({
    role: Joi.array()
      .items(Joi.string().valid("admin", "user", "visitor"))
      .optional()
      .messages({
        "array.includesUnknownOnly": "Invalid role filter value"
      }),
    status: Joi.array()
      .items(Joi.string().valid("active", "suspended", "unverified"))
      .optional()
      .messages({
        "array.includesUnknownOnly": "Invalid status filter value"
      }),
    dateRange: Joi.object({
      start: Joi.date().iso().optional().messages({
        "date.format": "Start date must be in ISO format"
      }),
      end: Joi.date().iso().min(Joi.ref("start")).optional().messages({
        "date.format": "End date must be in ISO format",
        "date.min": "End date must be after start date"
      })
    }).optional()
  }).optional(),
  sortBy: Joi.string()
    .valid("username", "email", "createdAt", "lastLoginAt", "role")
    .optional()
    .default("createdAt")
    .messages({
      "any.only": "Sort by must be one of: username, email, createdAt, lastLoginAt, role"
    }),
  sortOrder: Joi.string()
    .valid("asc", "desc")
    .optional()
    .default("desc")
    .messages({
      "any.only": "Sort order must be either 'asc' or 'desc'"
    })
});

// Validation middleware function for query parameters
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(", ");
      return res.status(400).json({
        success: false,
        message: "Query validation error",
        errors: errorMessage
      });
    }
    
    next();
  };
};

// Validation middleware function for body parameters
export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(", ");
      return res.status(400).json({
        success: false,
        message: "Body validation error",
        errors: errorMessage
      });
    }
    
    next();
  };
};

// Validation middleware function for URL parameters
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(", ");
      return res.status(400).json({
        success: false,
        message: "Parameter validation error",
        errors: errorMessage
      });
    }
    
    next();
  };
};
