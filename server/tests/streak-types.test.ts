import { PrismaClient, StreakType } from "@prisma/client";
import { faker } from '@faker-js/faker';
import request from "supertest";


import app from '../app'

const prisma = new PrismaClient()

describe('Streak Type API', () => {
  it('[INDEX] should return all of the streak types', async () => {
    // Arrange
    const names = Array.from(Array(3)).map(() => faker.animal.cat())

    await Promise.all(
      names.map(
        name => prisma.streakType.create({ data: { name } })
      )
    )

    // Act
    const response = await request(app)
      .get('/api/streak-types')
      .set('Accept', 'application/json')
    const responseStreakTypes = response.body


    // Assert
    expect(response.status).toEqual(200);
    responseStreakTypes.forEach((s: StreakType) => {
      expect(names).toContain(s.name)
    })
  })

  it('[SHOW] should return the streak type with provided id', async () => {
    // Arrange
    const name = faker.animal.cat()
    const saved = await prisma.streakType.create({ data: { name } })

    // Act
    const response = await request(app)
      .get(`/api/streak-types/${saved.id}`)
      .set('Accept', 'application/json')
    const responseBody = response.body

    // Assert
    expect(responseBody.name).toBe(name)
  })

  it('[CREATE] should create a streak type with the provided name', async () => {
    //Arrange
    const name = faker.animal.crocodilia();

    //Act
    const response = await request(app)
      .post(`/api/streak-types/`)
      .send({ name })
      .set('Accept', 'application/json')
    const responseBody = response.body

    const streakTypes = await prisma.streakType.findMany({
      where: { name }
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
    const saved = await prisma.streakType.create({ data: { name } })

    // Act
    const response = await request(app)
      .put(`/api/streak-types/${saved.id}`)
      .send({ name: newName })
      .set('Accept', 'application/json')
    const responseBody = response.body

    // Assert
    expect(responseBody.name).toBe(newName)
    const updatedStreakType = await prisma.streakType.findUnique({ where: { id: saved.id } })
    expect(updatedStreakType).not.toBeNull()
    if (updatedStreakType === null) { throw new Error('Streak type did not exist') }
    expect(updatedStreakType.name).toBe(newName)
  })

  it('[DELETE] should delete the streak type with provided id', async () => {
    // Arrange
    const name = faker.animal.cat()
    const saved = await prisma.streakType.create({ data: { name } })

    // Act
    await request(app)
      .delete(`/api/streak-types/${saved.id}`)
      .set('Accept', 'application/json')

    // Assert
    const deletedStreakType = await prisma.streakType.findUnique({ where: { id: saved.id } })
    expect(deletedStreakType).toBeNull()

  })
})
