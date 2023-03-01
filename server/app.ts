import express, { NextFunction, Request, Response } from 'express'
import { login, register } from './api/auth'
import {
  getStreakTypesApi,
  // createStreakTypeApi,
  showStreakTypeApi,
  deleteStreakTypeApi,
  updateStreakTypeApi,
} from './api/streak-types'

import jwt from 'jsonwebtoken'

const privateKey = String(process.env.TOKEN_KEY)

const app = express()

// @TODO add a test, extract to its own file
const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['x-access-token']

  if (!token || typeof token !== 'string') {
    return res.status(403).send('A token is required for authentication')
  }

  try {
    const decoded = jwt.verify(token, privateKey)

    if (typeof decoded === 'string') {
      throw new Error('Invalid JWT Token')
    }

    const { userId } = decoded
    req.userId = userId
  } catch (err) {
    return res.status(401).send('Invalid Token')
  }
  return next()
}

// Register our middleware
app.use(express.json()) // for parsing application/json

// User Routes
app.post('/api/register', register)
app.post('/api/login', login)

/******************
  * Authed Routes *
  *****************/
// Streak Routes
app.get('/api/streak-types', auth, getStreakTypesApi)
app.get('/api/streak-types/:id', showStreakTypeApi)
// app.post("/api/streak-types", createStreakTypeApi);
app.delete('/api/streak-types/:id', deleteStreakTypeApi)
app.put('/api/streak-types/:id', updateStreakTypeApi)

export default app
