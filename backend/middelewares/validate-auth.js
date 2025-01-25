const validate = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    next();
  } catch (err) {
    const extraDetail = err.errors[0].message;
    const message = "fill full properly";
    const status = 422;
    const error = {
      message,
      status,
      extraDetail,
    };
    next(error);
  }
};

module.exports = validate;
