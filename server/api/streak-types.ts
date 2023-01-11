import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const { streakType } = prisma;

// Index - get a list of StreakTypes
async function getStreakTypesApi(_: Request, res: Response) {
  res.status(200).json(await streakType.findMany());
}

// Show - get 1 specific streakType
async function showStreakTypeApi(req: Request, res: Response) {
  const { id } = req.params;
  res.status(200).json(await streakType.findUnique({ where: { id: Number(id) } }));
}

// Create
async function createStreakTypeApi(req: Request, res: Response): Promise<void> {
  const { name } = req.body;
  const newStreakType = await streakType.create({ data: { name } });

  res.status(202).json(newStreakType);
}

// @TODO Update
// Endpoint to change just the name of a streakType

// @TODO Delete
// Endpoint to delete a streaktype

export { getStreakTypesApi, createStreakTypeApi, showStreakTypeApi }
