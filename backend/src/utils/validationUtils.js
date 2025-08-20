import Joi from "joi";

// Validation utility functions for use in services
export const validateData = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false
  });
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(", ");
    return { error: errorMessage, isValid: false };
  }
  
  return { value, isValid: true };
};

// Validate user ID format
export const validateUserId = (userId) => {
  const userIdSchema = Joi.string().hex().length(24).required();
  return validateData(userIdSchema, userId);
};

// Validate email format
export const validateEmail = (email) => {
  const emailSchema = Joi.string().email().required();
  return validateData(emailSchema, email);
};

// Validate password strength
export const validatePassword = (password) => {
  const passwordSchema = Joi.string()
    .min(6)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required();
  return validateData(passwordSchema, password);
};

// Validate username format
export const validateUsername = (username) => {
  const usernameSchema = Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required();
  return validateData(usernameSchema, username);
};

// Validate role
export const validateRole = (role) => {
  const roleSchema = Joi.string()
    .valid("admin", "user", "visitor")
    .required();
  return validateData(roleSchema, role);
};

// Validate pagination parameters
export const validatePagination = (page, limit) => {
  const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  });
  return validateData(paginationSchema, { page, limit });
};

// Validate search query
export const validateSearchQuery = (query) => {
  const searchSchema = Joi.string().max(200).optional();
  return validateData(searchSchema, query);
};

// Validate date range
export const validateDateRange = (startDate, endDate) => {
  const dateRangeSchema = Joi.object({
    start: Joi.date().iso().optional(),
    end: Joi.date().iso().min(Joi.ref("start")).optional()
  });
  return validateData(dateRangeSchema, { start: startDate, end: endDate });
};

// Validate suspension reason
export const validateSuspensionReason = (reason) => {
  const reasonSchema = Joi.string()
    .min(10)
    .max(500)
    .required();
  return validateData(reasonSchema, reason);
};

// Validate token
export const validateToken = (token) => {
  const tokenSchema = Joi.string().required();
  return validateData(tokenSchema, token);
};

// Validate object ID array
export const validateObjectIdArray = (ids) => {
  const arraySchema = Joi.array()
    .items(Joi.string().hex().length(24))
    .min(1)
    .max(100);
  return validateData(arraySchema, ids);
};

// Generic validation function for any schema
export const validateWithSchema = (schema, data, options = {}) => {
  const defaultOptions = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false,
    ...options
  };
  
  const { error, value } = schema.validate(data, defaultOptions);
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(", ");
    return { error: errorMessage, isValid: false };
  }
  
  return { value, isValid: true };
};

// Validation result helper
export const createValidationResult = (isValid, data = null, error = null) => {
  return {
    isValid,
    data,
    error,
    timestamp: new Date().toISOString()
  };
};

// Batch validation for multiple fields
export const validateMultiple = (validations) => {
  const results = {};
  let hasErrors = false;
  
  for (const [field, validation] of Object.entries(validations)) {
    const result = validation;
    results[field] = result;
    
    if (result.error) {
      hasErrors = true;
    }
  }
  
  return {
    results,
    hasErrors,
    isValid: !hasErrors
  };
};
