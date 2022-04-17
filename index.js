const express = require('express')
const cors = require('cors')
const logger = require('./loggerMiddleware')
const app = express()

app.use(express.json())
app.use(cors())
app.use(logger)

let notes = [{
  id: 1,
  content: 'Nota número 1',
  date: '2019-05-22',
  important: true
},
{
  id: 2,
  content: 'Nota número 2',
  date: '2019-05-31',
  important: false
},
{
  id: 3,
  content: 'Nota número 3',
  date: '2019-06-02',
  important: true
}
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World! </h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})
app.post('/api/notes', (request, response) => {
  const note = request.body
  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }
  notes = [...notes, newNote]
  response.json(newNote)
})

app.use((request, response) => {
  console.log(request.path)
  response.status(404).json({
    error: 'not found'
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
