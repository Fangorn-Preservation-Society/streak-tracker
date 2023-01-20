import express from "express"
import { getStreakTypesApi, createStreakTypeApi, showStreakTypeApi, deleteStreakTypeApi, updateStreakTypeApi } from "./api/streak-types"

const app = express()

// Register our middleware
app.use(express.json()) // for parsing application/json

// Routes
app.get('/api/streak-types', getStreakTypesApi)
app.get('/api/streak-types/:id', showStreakTypeApi)
app.post('/api/streak-types', createStreakTypeApi)
app.delete('/api/streak-types/:id', deleteStreakTypeApi)
app.put('/api/streak-types/:id', updateStreakTypeApi)

export default app
