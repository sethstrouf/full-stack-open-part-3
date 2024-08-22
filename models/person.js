const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to database...')

mongoose.connect(url)
  .then(result => {
    console.log('...connected to MongoDB')
  })
  .catch(error => {
    console.log('...error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'must be at least 3 characters']
  },
  number: {
    type: String,
    minLength: [8, 'must be at least 8 characters'],
    validate: {
      validator: v => {
        return /(?<!\d)\d{3}(?!\d)-(?<!\d)\d{3}(?!\d)-(?<!\d)\d{4}(?!\d)/.test(v)
      },
      message: 'must be a valid phone number with the format ###-###-####'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)