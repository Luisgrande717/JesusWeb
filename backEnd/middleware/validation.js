import Joi from 'joi';

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path[0],
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

// User registration validation schema
export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().trim().optional(),
  role: Joi.string().valid('user', 'mechanic').optional()
});

// User login validation schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Appointment creation validation schema
export const appointmentSchema = Joi.object({
  serviceType: Joi.string().valid(
    'oil_change',
    'brake_service',
    'tire_rotation',
    'engine_diagnostic',
    'transmission_service',
    'battery_replacement',
    'ac_service',
    'general_inspection',
    'custom'
  ).required(),
  customService: Joi.string().trim().when('serviceType', {
    is: 'custom',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  scheduledDate: Joi.date().iso().min('now').required(),
  scheduledTime: Joi.string().required(),
  notes: Joi.string().max(500).optional(),
  carInfo: Joi.object({
    make: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
    licensePlate: Joi.string().optional()
  }).required()
});

// Repair update validation schema
export const repairUpdateSchema = Joi.object({
  appointmentId: Joi.string().required(),
  message: Joi.string().max(1000).required(),
  stage: Joi.string().valid(
    'inspection',
    'diagnosis',
    'parts_ordered',
    'in_repair',
    'quality_check',
    'completed'
  ).required(),
  estimatedCompletion: Joi.date().iso().optional(),
  isPrivate: Joi.boolean().optional()
});
