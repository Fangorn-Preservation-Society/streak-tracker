import { Request, Response } from 'express'
import { prisma } from '../prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

interface Credentials {
    email: string
    password: string
}

const privateKey = String(process.env.TOKEN_KEY)
const generateAndSaveToken = async function ({
    email,
    id,
}: {
    email: string
    id: string
}) {
    const token = jwt.sign({ userId: id, email }, privateKey, {
        expiresIn: '2h',
    })

    await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            token,
        },
    })
    return token
}

export async function register(req: Request, res: Response) {
    const { email, password }: Credentials = req.body

    if (!(email && password)) {
        return res.status(400).send('All input is required')
    }

    const oldUser = await prisma.user.findUnique({ where: { email } })

    if (oldUser) {
        return res.status(409).send('User already exists. Please login')
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        },
    })

    const token = await generateAndSaveToken({ id: user.id, email })

    return res.status(201).json({ id: user.id, token })
}

export async function login(req: Request, res: Response) {
    const { email, password }: Credentials = req.body

    if (!(email && password)) {
        return res.status(400).send('All input is required')
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        return res.status(409).send('No account associated with email.')
    }

    const passwordCorrect = await bcrypt.compare(password, user.password)

    if (!passwordCorrect) {
        return res.status(409).send('Password is incorrect. Please try again.')
    }

    const token = await generateAndSaveToken({ id: user.id, email })

    return res.status(200).json({ id: user.id, token })
}
