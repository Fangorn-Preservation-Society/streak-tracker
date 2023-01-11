import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { streakType } = prisma;

async function getStreakTypesApi(_: Request, res: Response) {
  res.status(200).json(await streakType.findMany());
}

async function showStreakTypeApi(req: Request, res: Response) {
  const { id } = req.params;
  res.status(200).json(await streakType.findUnique({ where: { id: Number(id) } }));
}

async function createStreakTypeApi(req: Request, res: Response): Promise<void> {
  const { name } = req.body;
  const newStreakType = await streakType.create({ data: { name } });

  res.status(202).json(newStreakType);
}



export { getStreakTypesApi, createStreakTypeApi, showStreakTypeApi }
