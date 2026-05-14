const app = require('./app')
const connectDB = require('./config/db')
require('dotenv').config()

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor VitaCare corriendo en puerto ${PORT}`)
    console.log(`URL: http://localhost:${PORT}`)
  })
}).catch((error) => {
  console.error('Error al iniciar el servidor:', error)
  process.exit(1)
})