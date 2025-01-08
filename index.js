const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('request-body', (request) => {
    // console.log(request.body, typeof(request.body))
    // console.log("stringify:", JSON.stringify(request.body), typeof(JSON.stringify(request.body)))
    return JSON.stringify(request.body)
})

const app = express()

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

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))
app.use(cors())
app.use(express.static('dist'))

const checkUniqueness = (body, bodyProp) => {
    const match = persons.filter(person => person[bodyProp] === body[bodyProp])
    // console.log("match", match)
    if(match.length > 0) {
        return false
    }
    return true
}

const checkMissing = (body) => {
    missing = Object.keys(body)
    .filter(key => !Boolean(body[key]))
    // console.log("checkMissing", missing)

    if (missing.length > 0) {
        return missing
    }}

const generateId = () => {
    const id = Math.floor(Math.random() * 1000)
    return id.toString()
    // console.log("id", id)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    // check if a property is missing a value
    const missing = checkMissing(body)
    // console.log("missing", missing)
    if (missing) {
        return response.status(400).json(
            {error: `${missing.join(' and ')} is missing`}
        )
    }

    // check if name is unique
    if (checkUniqueness(body,"name")) {
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number,
        }        
        persons = persons.concat(person)
        response.json(person)
    } else {
        return response.status(400).json(
            {error: 'name must be unique'}
        )
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.filter(person => person.id === request.params.id)
    console.log(person, Boolean(person))
    // const person = persons[request.params.id]
    if(person.length > 0) {
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})