import jwt from "jsonwebtoken";
import { Response } from "express";

const generateToken = (userId: string, res: Response) => {
  const payload = { id: userId };
  const secret: string | undefined = process.env.JWT_SECRET;

  if (!secret) throw new Error("JWT_SECRET is not defined");

  const token: string = jwt.sign(payload, secret, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 1,
  });

  return token;
};

export { generateToken };
