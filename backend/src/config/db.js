const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI
    console.log('Connecting to MongoDB...')
    console.log('URI exists:', !!uri)
    await mongoose.connect(uri)
    console.log('MongoDB Atlas conectado ✅')
  } catch (error) {
    console.error(`Error conectando MongoDB: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB