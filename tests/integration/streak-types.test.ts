import { PrismaClient, StreakType } from "@prisma/client";
import { faker } from '@faker-js/faker';
import request from "supertest";

import app from '../../server/app'

const prisma = new PrismaClient()

describe('Streak Type API', () => {
  it('should return all of the streak types', async () => {
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

  it('should return the streak type with provided id', async () => {
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
})
