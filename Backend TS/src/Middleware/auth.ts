// middleware/auth.ts
import jwt,{JwtPayload} from "jsonwebtoken";
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";


dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET ;

//Always check if the secret key is defined before using it.
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const authorizeToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    ( req as any).user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(400).json({ message: "Invalid token." });
  }
} 

//give access based on user role
export const authorizeRole = (role: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as JwtPayload;

    if (!user || !role.includes(user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};