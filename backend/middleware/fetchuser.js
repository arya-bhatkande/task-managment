const jwt = require('jsonwebtoken');

const fetchuser = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).send({ error: "Access Denied: Token missing" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data.user; // Extract the user object
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
        return res.status(401).send({ error: "Token expired. Please log in again." });
      }
  
    res.status(401).send({ error: "Access Denied: Invalid Token" });
  }
};

module.exports = fetchuser;
