import createApp from '../src'

void (async () => {
  const PORT = 8000
  const app = await createApp()

  app.listen(PORT, () => {
    console.log(`server is running at ${PORT}`)
  })

})()
