const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const User = require('./src/models/User')
    await User.updateOne(
        { email: 'romarioquispe214@gmail.com' },
        { isVerified: true }
    )
    console.log('Cuenta verificada!')
    process.exit()
})