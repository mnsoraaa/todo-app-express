import { Router } from 'express';
import createNewUserRequest from '../requests/createNewUserRequest.js';
import pool from '../databases/database.mjs';
import bcrypt from 'bcrypt';

import eventEmitter from '../events/event.mjs';
import '../events/users/userRegisteredEvent.mjs';

const router = Router();

let users = [
    { id: 1, name: "John", age: 20 },
    { id: 2, name: "Wock", age: 25 },
];

// middleware to validate user id
const validateUserId = (request, response, next) => {
    const { params: { id } } = request;

    if (isNaN(parseInt(id))) response.status(422).json({"message": "Invalid id"});
    
    next();
}

// Get all users
router.get('/api/users', async (request, response) => {
    try {
        const { query: { filter, value } } = request;
    
        if (filter && value) {

            const filteredusers = pool.query("SELECT * FROM users WHERE ?? = ?", [filter, value]);

            response.json(filteredusers);

        }

        const users = await pool.query("SELECT * FROM users");
        
        response.json(users);
    } catch (error) {
        
    }

    response.status(400).json({"message": "Unable to find users"});
});

// Get user by id
router.get('/api/users/:id', validateUserId, async (request, response) => {
    try {
        const id = parseInt(request.params.id);

        const user = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

        response.status(200).json(user);
    } catch (error) {
        
    }
    response.status(400).json({"message": "Unable to find user"});
});

// Create a new user
router.post('/api/users', async (request, response) => {
    try {
        // validate request
        const validatedCreateUserRequest = createNewUserRequest.parse(request.body);

        const result = await pool.query("INSERT INTO users (email, first_name, last_name, password) VALUES (?,?,?,?)", [validatedCreateUserRequest.email, validatedCreateUserRequest.first_name, validatedCreateUserRequest.last_name, await bcrypt.hash(validatedCreateUserRequest.password, 10)]);

        eventEmitter.emit('event:userRegistered', {user_id: Number(result.insertId)});

        response.status(201).json({user_id: Number(result.insertId)});
    } catch (error) {
        // if validation fails, respond with error message
        response.status(400).json({"message": error});
    }
});

// Update user by id
router.put('/api/users/:id', validateUserId, (request, response) => {
    const { params: { id }, body } = request;

    let user = users.find((user) => user.id == id);

    if (! user) response.status(404).json({"message": "User not found"});

    user.name = body.name;

    response.status(200).json(user);
});

// Delete a user
router.delete('/api/users/:id', validateUserId, (request, response) => {
    const { params: { id } } = request;
    const userIndex = users.findIndex((user) => user.id == id);

    if (userIndex === -1) response.status(404).json({"message": "User not found"});

    users = users.splice(userIndex, 1);

    response.status(200);
});

export default router;