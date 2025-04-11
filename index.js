import express from 'express'
import fileUpload from 'express-fileupload'
import db from './config/db.js'
import cors from 'cors'
import configurarRutas from './routes/index.js'

// App
const app = express()
const PORT = 3000

// Database
try {
  await db.authenticate()
  // await db.sync({force: true});
  console.log('Connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

// JSON
app.use(express.json())
app.use(cors())
// Pug
app.set('view engine', 'pug')
app.set('views', './views')

// Static files
app.use(express.static('public'))
// File Upload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}))
// Habilitar lectura forms
app.use(express.urlencoded({ extended: true }))

// Routes
configurarRutas(app)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
