import { StreakType, User } from '@prisma/client'
import { faker } from '@faker-js/faker'
import request from 'supertest'

import { prisma } from '../prisma/'

import app from '../app'
import factories from './factories'

let user: User

describe('Streak Type API', () => {
    beforeEach(async () => {
        user = await factories.users.create({ password: 'chubby-puppy' })
    })

    it('[INDEX] should return all of the streak types for a user', async () => {
        // Arrange
        const names = Array.from(Array(3)).map(() => faker.animal.cat())

        await Promise.all(
            names.map((name) =>
                prisma.streakType.create({ data: { name, userId: user.id } })
            )
        )
        const shouldNotFind = await prisma.streakType.create({
            data: {
                name: faker.animal.cat(),
                userId: (await factories.users.create()).id,
            },
        })

        const tokenResponse = await request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send({ email: user.email, password: 'chubby-puppy' })
        const { token } = tokenResponse.body

        // Act
        const response = await request(app)
            .get('/api/streak-types')
            .set('Accept', 'application/json')
            .set('x-access-token', token)
        const responseStreakTypes = response.body

        // Assert
        expect(response.status).toEqual(200)
        responseStreakTypes.forEach((s: StreakType) => {
            expect(names).toContain(s.name)
        })
        expect(
            responseStreakTypes.find(
                (s: StreakType) => s.name === shouldNotFind.name
            )
        ).toBeFalsy()
    })

    it('[SHOW] should return the streak type with provided id for its owner', async () => {
        // Arrange
        const name = faker.animal.cat()
        const saved = await prisma.streakType.create({
            data: { name, userId: user.id },
        })

        const tokenResponse = await request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send({ email: user.email, password: 'chubby-puppy' })
        const { token } = tokenResponse.body

        // Act
        const response = await request(app)
            .get(`/api/streak-types/${saved.id}`)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
        const responseBody = response.body

        // Assert
        expect(responseBody.name).toBe(name)
    })

    it("[SHOW] should prevent user from looking at other users' streak types", async () => {
        // Arrange
        const name = faker.animal.cat()
        const saved = await prisma.streakType.create({
            data: { name, userId: user.id },
        })
        const wormtongue = await factories.users.create({
            password: 'sarumanrules',
        })

        const tokenResponse = await request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send({ email: wormtongue.email, password: 'sarumanrules' })
        const { token } = tokenResponse.body

        // Act
        const response = await request(app)
            .get(`/api/streak-types/${saved.id}`)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
        const responseBody = response.body

        // Assert
        expect(response.statusCode).toBe(404)
        expect(responseBody).toEqual({
            message: `unable to find streak type with id ${saved.id}`,
        })
    })

    it('[CREATE] should create a streak type with the provided name', async () => {
        //Arrange
        const name = faker.animal.crocodilia()

        //Act
        const response = await request(app)
            .post(`/api/streak-types/`)
            .send({ name })
            .set('Accept', 'application/json')
        const responseBody = response.body

        const streakTypes = await prisma.streakType.findMany({
            where: { name },
        })
        const firstType = streakTypes[0]

        //Assert
        expect(responseBody.name).toBe(name)
        expect(firstType.name).toBe(name)
    })

    it('[UPDATE] should update the name of specified streak type', async () => {
        // Arrange
        const name = faker.animal.cat()
        const newName = faker.animal.rabbit()
        const saved = await prisma.streakType.create({
            data: { name, userId: user.id },
        })

        // Act
        const response = await request(app)
            .put(`/api/streak-types/${saved.id}`)
            .send({ name: newName })
            .set('Accept', 'application/json')
        const responseBody = response.body

        // Assert
        expect(responseBody.name).toBe(newName)
        const updatedStreakType = await prisma.streakType.findUnique({
            where: { id: saved.id },
        })
        expect(updatedStreakType).not.toBeNull()
        if (updatedStreakType === null) {
            throw new Error('Streak type did not exist')
        }
        expect(updatedStreakType.name).toBe(newName)
    })

    it('[DELETE] should delete the streak type with provided id if initiated by owner', async () => {
        // Arrange
        const name = faker.animal.cat()
        const saved = await prisma.streakType.create({
            data: { name, userId: user.id },
        })

        const tokenResponse = await request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send({ email: user.email, password: 'chubby-puppy' })
        const { token } = tokenResponse.body

        // Act
        const response = await request(app)
            .delete(`/api/streak-types/${saved.id}`)
            .set('Accept', 'application/json')
            .set('x-access-token', token)

        // Assert
        expect(response.statusCode).toBe(202)
        const deletedStreakType = await prisma.streakType.findUnique({
            where: { id: saved.id },
        })
        expect(deletedStreakType).toBeNull()
    })

    it("[DELETE] should prevent user from deleting other users' streak types", async () => {
        // Arrange
        const name = faker.animal.cat()
        const saved = await prisma.streakType.create({
            data: { name, userId: user.id },
        })
        const wormtongue = await factories.users.create({
            password: 'sarumanrules',
        })

        const tokenResponse = await request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send({ email: wormtongue.email, password: 'sarumanrules' })
        const { token } = tokenResponse.body

        // Act
        const response = await request(app)
            .delete(`/api/streak-types/${saved.id}`)
            .set('Accept', 'application/json')
            .set('x-access-token', token)
        const responseBody = response.body

        // Assert
        expect(response.statusCode).toBe(404)
        expect(responseBody).toEqual({
            message: `unable to find streak type with id ${saved.id}`,
        })
    })
})
