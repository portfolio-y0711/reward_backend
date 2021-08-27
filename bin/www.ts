import createApp from '../src'

const app = createApp()
const PORT = 5000

app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`)
})