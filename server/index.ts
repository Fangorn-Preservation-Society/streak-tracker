import express from "express"
import { getStreakTypesApi, createStreakTypeApi } from "./api/streak-types"

const app = express()
const port = 3000

app.use(express.json()) // for parsing application/json
app.get('/streak-types', getStreakTypesApi)
app.post('/streak-types', createStreakTypeApi)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
