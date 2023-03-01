import { User } from '@prisma/client'
import { prisma } from '../../prisma/'
import bcrypt from 'bcryptjs'
import { faker } from '@faker-js/faker'

const create = async ({
    email,
    password,
}: {
    email?: string
    password?: string
} = {}): Promise<User> => {
    return prisma.user.create({
        data: {
            email: email || faker.internet.email(),
            password: await bcrypt.hash(
                password || faker.internet.password(),
                10
            ),
        },
    })
}

export default {
    create,
}
