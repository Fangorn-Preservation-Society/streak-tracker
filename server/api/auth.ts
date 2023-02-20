import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function register(req: Request, res: Response) {
  try {
    const { email, password }: { email: string; password: string } = req.body;

    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    const oldUser = await prisma.user.findUnique({ where: { email } });

    if (oldUser) {
      return res.status(409).send("User already exists. Please login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      },
    });

    const privateKey = String(process.env.TOKEN_KEY);
    const token = jwt.sign({ userId: user.id, email }, privateKey, {
      expiresIn: "2h",
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token,
      },
    });

    return res.status(201).json({ id: user.id, token: user.token });
  } catch (err) {
    return res.status(500).json({ message: "Unable to create user", err });
  }
}
