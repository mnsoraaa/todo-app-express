import { Router } from 'express';
import createNewUserRequest from '../requests/createNewUserRequest.mjs';
import pool from '../databases/database.mjs';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import eventEmitter from '../events/event.mjs';
import '../events/users/userRegisteredEvent.mjs';

const router = Router();

// middleware to validate user id
const validateUserId = (request, response, next) => {
    const { params: { id } } = request;

    if (isNaN(parseInt(id))) response.status(422).json({"message": "Invalid id"});
    
    next();
}

// Get all users
router.get('/api/users', async (request, response) => {
    try {
        const { query: { search } } = request;
    
        if (search) {

            const filteredusers = pool.query("SELECT * FROM users WHERE first_name LIKE '?' OR WHERE last_name LIKE '?'", [search, search]);

            response.json(filteredusers);

        }

        const users = await pool.query("SELECT * FROM users");
        
        return response.json(users);
    } catch (error) {
        console.log(error);
    }

    return response.status(400).json({"message": "Unable to find users"});
});

// Get user by id
router.get('/api/users/:id', validateUserId, async (request, response) => {
    try {
        const id = parseInt(request.params.id);

        const user = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

        return response.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
    return response.status(400).json({"message": "Unable to find user"});
});

// Create a new user
router.post('/api/users', async (request, response) => {
    try {
        // validate request
        const validatedCreateUserRequest = createNewUserRequest.parse(request.body);

        const result = await pool.query("INSERT INTO users (email, first_name, last_name, password) VALUES (?,?,?,?)", [validatedCreateUserRequest.email, validatedCreateUserRequest.first_name, validatedCreateUserRequest.last_name, await bcrypt.hash(validatedCreateUserRequest.password, 10)]);

        eventEmitter.emit('event:userRegistered', {user_id: Number(result.insertId)});

        return response.status(201).json({user_id: Number(result.insertId)});
    } catch (error) {
        if (error instanceof z.ZodError) {
            return response.status(400).json({ "message": error.errors[0].message });
        }

        console.log(error);
    }
    // if validation fails, respond with error message
    return response.status(503).json({"message": "Service unavailable"});
});

// Update user by id
router.put('/api/users/:id', validateUserId, async (request, response) => {
    try {
        const { params: { id }, body } = request;

        let user = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

        if (! user) response.status(404).json({"message": "User not found"});

        await pool.query("UPDATE users SET first_name = ?, last_name = ? WHERE id = ?", [body.first_name, body.last_name, id]);

        return response.status(200).json({"message": "Successfully update user."});
    } catch (error) {
        console.log(error);
    }
    return response.status(503).json({"message": "Service unavailable"});
});

// Delete a user
router.delete('/api/users/:id', validateUserId, async (request, response) => {
    try {
        const { params: { id } } = request;
        
        await pool.query("DELETE FROM users WHERE id = ?", [id]);

        return response.status(200).json({"message": "Successfully deleted user."});
    } catch (error) {
        console.log(error);
    }
    return response.status(503).json({"message": "Service unavailable"});
});

export default router;