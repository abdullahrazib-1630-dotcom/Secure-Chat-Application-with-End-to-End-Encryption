const { body, param, validationResult, query } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  return next();
};

const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 80 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isStrongPassword({ minLength: 8, minSymbols: 1 }),
  validate,
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('rememberMe').optional().isBoolean(),
  validate,
];

const messageValidation = [
  body('receiverId').isMongoId(),
  body('encryptedMessage').isString().isLength({ min: 1, max: 5000 }),
  body('iv').optional().isString(),
  body('authTag').optional().isString(),
  body('algorithm').optional().isString(),
  validate,
];

const objectIdParamValidation = [param('id').isMongoId(), validate];

const searchValidation = [
  query('q').trim().isLength({ min: 1, max: 60 }).escape(),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  messageValidation,
  objectIdParamValidation,
  searchValidation,
};
