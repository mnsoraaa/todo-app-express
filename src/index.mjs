import express from "express"
import createNewUserSchema from "./requests/CreateNewUserSchema.js";

const app = express();
app.use(express.json());

const APP_PORT = process.env.APP_PORT || 3000;

let users = [
    { id: 1, name: "John" },
    { id: 2, name: "Wock" }
];

// middleware for loggin
const loggingMiddleware = (request, response, next) => {
    console.log(request.method + "-" + request.path);
    next();
}

// middleware to validate user id
const validateUserId = (request, response, next) => {
    const { params: { id } } = request;

    if (isNaN(parseInt(id))) return response.status(422).send({"message": "Invalid id"});
    
    next();
}

app.use(loggingMiddleware);

app.get('/', (request, response) => {
    response.send("Hello world!")
});

// Get all users
app.get('/api/users', (request, response) => {
    const { query: { filter, value } } = request;
    
    if (filter && value) {

        let filteredusers = users.filter((user) => user[filter].includes(value));

        return response.send(filteredusers);

    }
    
    return response.send(users);
});

// Get user by id
app.get('/api/users/:id', validateUserId, (request, response) => {
    let user = users.find((user) => user.id == request.params.id);

    if (! user) return response.status(404).send({"message": "User not found"});

    return response.send(user);
});

// Get user by id
app.post('/api/users/:id', validateUserId, (request, response) => {
    let user = users.find((user) => user.id == request.params.id);

    const id = parseInt(request.params.id);

    return response.send(user);
});

// Create a new user
app.post('/api/users', (request, response) => {
    try {
        // validate request body againts schema
        const validateCreateUserBody = createNewUserSchema.parse(request.body);

        users.push({ id: users.length + 1, ...validateCreateUserBody });

        return response.status(201).send(users);
    } catch (error) {
        // if validation fails, respond with error message
        return response.status(400).send({"message": error.errors[0].message});
    }
});

// Update user by id
app.put('/api/users/:id', validateUserId, (request, response) => {
    const { params: { id }, body } = request;

    let user = users.find((user) => user.id == id);

    if (! user) return response.status(404).send({"message": "User not found"});

    user.name = body.name;

    return response.send(user);
});

// Delete a user
app.delete('/api/users/:id', validateUserId, (request, response) => {
    const { params: { id } } = request;
    const userIndex = users.findIndex((user) => user.id == id);

    if (userIndex === -1) return response.status(404).send({"message": "User not found"});

    users = users.splice(userIndex, 1);

    return response.status(200).send();
});

// Start app server
app.listen(APP_PORT, () => {
    console.log(`Running on port ${APP_PORT}`);
});