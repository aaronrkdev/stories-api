import bcrypt from "bcrypt";
import { prisma } from "../configs/db";
import { RegistrationBody } from "../validators/auth.validator";
import { Request, Response } from "express";
import { generateToken } from "../lib/jwt";

const registration = async (
  req: Request<{}, {}, RegistrationBody>,
  res: Response,
) => {
  const { email, username, password } = req.body;

  const userExist = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExist) {
    return res.status(409).json({ error: "User already exist" });
  }

  const usernameExist = await prisma.user.findUnique({
    where: { username: username },
  });

  if (usernameExist) {
    return res.status(409).json({ error: "User name already used" });
  }

  //has password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });

  //token generation
  const token = generateToken(user.id, res);
  res
    .status(201)
    .json({ status: "success", data: { id: user.id, username }, token });
};

const login = async (req: Request<{}, {}, RegistrationBody>, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  //password verification
  const isPasswordValid = bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  //generate token
  const token = generateToken(user.id, res);
  res.status(200).json({
    status: "success",
    data: { id: user.id, email: user.email },
    token,
  });
};

const logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res
    .status(200)
    .json({ status: "success", message: "Loged out successfully" });
};

export { registration, login, logout };
