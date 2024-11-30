const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]


const checkMissing = (body) => {
    console.log("body", body)
    missing = Object.keys(body)
    .filter(key => !Boolean(body[key]))
    console.log("checkMissing", missing)

    if (missing.length > 0) {
        return missing
    }}

const generateId = () => {
    const id = Math.floor(Math.random() * 1000)
    console.log("id", id)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    const missing = checkMissing(body)
    console.log("missing", missing)
    if (missing) {
        return response.status(400).json(
            {error: `${missing.join(' and ')} is missing`}
        )
    }

    // if (!(body.name && body.number)) {
    //     return response.status(400).json(
    //         {error: 'name and number are missing'}
    //     )
    // } else if (!body.number) {
    //     return response.status(400).json(
    //         {error: 'number is missing'}
    //     )
    // } else if (!body.name) {
    //     return response.status(400).json(
    //         {error: 'name is missing'}
    //     )        
    // }

    // const person = {
    //     id: generateId(),
    //     name: body.name,
    //     number: body.number,
    // }

    // persons = persons.concat(person)
    // response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons[request.params.id]
    if(person) {
        response.json(person)
    } else {
        response.status(404).send()
    }
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`)
})

app.get('/', (request, reponse) => {
    reponse.send('<h1>Welcome to phonebook backend</h1>')
})

const PORT = 3001
app.listen(PORT,() => {
    console.log(`Server running on port ${PORT}`)
    
})