const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "backend error";
  const extraDetail = err.extraDetail || "error from backend";
  return res.status(status).json({ message, extraDetail });
};

module.exports = { errorHandler };
