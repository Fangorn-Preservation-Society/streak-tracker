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

  res.status(201).json(newStreakType);
}

// Delete
async function deleteStreakTypeApi(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  await streakType.delete({ where: { id: Number(id), }, });

  res.status(202).json({});
}

// Update
async function updateStreakTypeApi(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { name } = req.body;

  const updateStreakType = await streakType.update({
    where: {
      id: Number(id)
    },
    data: {
      name,
    },
  })
  res.status(200).json(updateStreakType);
}

export { getStreakTypesApi, createStreakTypeApi, showStreakTypeApi, deleteStreakTypeApi, updateStreakTypeApi }
