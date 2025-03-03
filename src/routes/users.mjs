import { Router } from 'express';
import createNewUserSchema from '../requests/createNewUserSchema.js';

const router = Router();

let users = [
    { id: 1, name: "John", age: 20 },
    { id: 2, name: "Wock", age: 25 },
];

// middleware to validate user id
const validateUserId = (request, response, next) => {
    const { params: { id } } = request;

    if (isNaN(parseInt(id))) return response.status(422).send({"message": "Invalid id"});
    
    next();
}

// Get all users
router.get('/api/users', (request, response) => {
    const { query: { filter, value } } = request;
    
    if (filter && value) {

        let filteredusers = users.filter((user) => user[filter].includes(value));

        return response.send(filteredusers);

    }
    
    return response.send(users);
});

// Get user by id
router.get('/api/users/:id', validateUserId, (request, response) => {
    let user = users.find((user) => user.id == request.params.id);

    if (! user) return response.status(404).send({"message": "User not found"});

    return response.send(user);
});

// Get user by id
router.post('/api/users/:id', validateUserId, (request, response) => {
    let user = users.find((user) => user.id == request.params.id);

    const id = parseInt(request.params.id);

    return response.send(user);
});

// Create a new user
router.post('/api/users', (request, response) => {
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
router.put('/api/users/:id', validateUserId, (request, response) => {
    const { params: { id }, body } = request;

    let user = users.find((user) => user.id == id);

    if (! user) return response.status(404).send({"message": "User not found"});

    user.name = body.name;

    return response.send(user);
});

// Delete a user
router.delete('/api/users/:id', validateUserId, (request, response) => {
    const { params: { id } } = request;
    const userIndex = users.findIndex((user) => user.id == id);

    if (userIndex === -1) return response.status(404).send({"message": "User not found"});

    users = users.splice(userIndex, 1);

    return response.status(200).send();
});

export default router;