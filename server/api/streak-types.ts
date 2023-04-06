import { Request, Response } from 'express'
import { prisma } from '../prisma'

// Index - get a list of StreakTypes
async function getStreakTypesApi(req: Request, res: Response) {
    const { userId } = req
    res.status(200).json(
        await prisma.streakType.findMany({
            where: {
                userId,
            },
        })
    )
}

// Show - get 1 specific prisma.streakType
async function showStreakTypeApi(req: Request, res: Response) {
    const { userId, params } = req
    const { id } = params
    const streakType = await prisma.streakType.findFirst({
        where: { id: Number(id), userId },
    })

    if (streakType) {
        res.status(200).json(streakType)
        return
    }
    res.status(404).json({
        message: `unable to find streak type with id ${id}`,
    })
}

// Create
// async function createStreakTypeApi(req: Request, res: Response): Promise<void> {
// const { name } = req.body
// const newStreakType = await prisma.streakType.create({ data: { name } })
//
// res.status(201).json(newStreakType)
// }

// Delete
async function deleteStreakTypeApi(req: Request, res: Response): Promise<void> {
    const { userId, params } = req
    const { id } = params
    const streakType = await prisma.streakType.findFirst({
        where: { id: Number(id), userId },
    })

    if (streakType) {
        await prisma.streakType.delete({ where: { id: streakType.id } })

        res.status(202).json({})
        return
    }

    res.status(404).json({
        message: `unable to find streak type with id ${id}`,
    })
}

// Update
async function updateStreakTypeApi(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { name } = req.body

    const updateStreakType = await prisma.streakType.update({
        where: {
            id: Number(id),
        },
        data: {
            name,
        },
    })
    res.status(200).json(updateStreakType)
}

export {
    getStreakTypesApi,
    // createStreakTypeApi,
    showStreakTypeApi,
    deleteStreakTypeApi,
    updateStreakTypeApi,
}
