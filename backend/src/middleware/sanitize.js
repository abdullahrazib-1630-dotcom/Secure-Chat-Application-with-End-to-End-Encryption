const sanitizeObject = (input) => {
  if (Array.isArray(input)) {
    input.forEach((item, index) => {
      input[index] = sanitizeObject(item);
    });
    return input;
  }

  if (input && typeof input === 'object') {
    Object.keys(input).forEach((key) => {
      const sanitizedKey = key.replace(/\$/g, '').replace(/\./g, '');
      if (sanitizedKey !== key) {
        input[sanitizedKey] = input[key];
        delete input[key];
      }
      input[sanitizedKey] = sanitizeObject(input[sanitizedKey]);
    });
  }

  return input;
};

const sanitizeInput = (req, res, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  if (req.query) sanitizeObject(req.query);
  next();
};

module.exports = sanitizeInput;
