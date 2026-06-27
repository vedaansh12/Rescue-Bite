const { body, validationResult } = require('express-validator');

exports.validateCreatePack = [
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .escape(),
  body('originalPrice')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 1 })
    .withMessage('Price must be at least 1'),
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive whole number'),
  body('availableUntil')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];