import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import request from "supertest";
import bcrypt from "bcryptjs";

import app from "../app";
import assert from "assert";

const prisma = new PrismaClient();
const { user } = prisma;

interface ResponseBody {
  token: string;
}

describe("Auth API", () => {
  it("can register for StreakTraker", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const response = await request(app)
      .post(`/api/register/`)
      .send({ email, password })
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    const responseBody: ResponseBody = response.body;
    const newUser = await user.findUnique({
      where: { email: email.toLowerCase() },
    });
    assert(newUser, "Could not find expected user");
    expect(newUser.token).toBe(responseBody.token);
  });

  it("can log in to StreakTraker", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    await user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
      },
    });

    const response = await request(app)
      .post(`/api/login/`)
      .send({ email, password })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);
    const responseBody: ResponseBody = response.body;
    const users = await user.findMany({
      where: { token: { equals: responseBody.token } },
    });

    expect(users.length).toBe(1);
    const u = users[0];
    assert(u, "Did not find expected user");
    expect(u.token).toBe(responseBody.token);
  });
});
