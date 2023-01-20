import express from "express"
import { getStreakTypesApi, createStreakTypeApi, showStreakTypeApi, deleteStreakTypeApi, updateStreakTypeApi } from "./api/streak-types"

const app = express()
const port = 3000

// Register our middleware
app.use(express.json()) // for parsing application/json

// Routes
app.get('/streak-types', getStreakTypesApi)

app.get('/streak-types/:id', showStreakTypeApi)
app.post('/streak-types', createStreakTypeApi)
app.delete('/streak-types/:id', deleteStreakTypeApi)
app.put('/streak-types/:id', updateStreakTypeApi)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
