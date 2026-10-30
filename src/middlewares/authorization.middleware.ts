import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../configs/db";

const extractToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  if (req.cookies?.jwt) return req.cookies.jwt;
  return null;
};

const findUserFromToken = async (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  try {
    const decode = jwt.verify(token, secret);
    if (typeof decode === "string") return null;

    return await prisma.user.findUnique({
      where: { id: decode.id },
      select: { id: true, email: true, password: true },
    });
  } catch {
    return null; // token invalid ou expiré
  }
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: "Permission denied" });
  }

  const user = await findUserFromToken(token);
  if (!user) {
    return res.status(401).json({ error: "Invalid token / Invalid user" });
  }
  req.user = user;
  next();
};

export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = extractToken(req);
  if (token) {
    const user = await findUserFromToken(token);
    if (user) req.user = user;
  }
  next();
};
