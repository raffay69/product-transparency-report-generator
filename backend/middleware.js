import jwt from "jsonwebtoken";
import "dotenv/config";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, process.env.JWT_PUBLIC);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.userId = decoded.sub;
  next();
}
