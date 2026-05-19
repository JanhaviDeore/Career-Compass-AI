import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Not authorized");
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized");
  }
};

export default authMiddleware;
