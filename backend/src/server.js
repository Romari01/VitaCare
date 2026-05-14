require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

console.log('PORT:', PORT)
console.log('MONGO_URI exists:', !!MONGO_URI)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor VitaCare corriendo en puerto ${PORT}`)
    console.log(`URL: http://localhost:${PORT}`)
  })
}).catch((error) => {
  console.error('Error al iniciar el servidor:', error)
  process.exit(1)
})