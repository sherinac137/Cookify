const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing token" });
  }

  // Extract token from Authorization header
  const tokenPart = token.split(" ")[1]; // Get the actual token
  if (!tokenPart) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid token format" });
  }

  // Verify the token
  jwt.verify(tokenPart, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Attach userId to request object
    req.userId = decoded.userId;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = verifyToken;
