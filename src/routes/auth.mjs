import { Router } from "express";
import jwt from "jsonwebtoken";
import loginUserRequest from "../requests/loginUserRequest.mjs";
import pool from "../databases/database.mjs";
import bcrypt from "bcrypt";
import { z } from "zod";

const router = Router();

// Auth routes
router.post('/api/login', async (request, response) => {
    try {
        const validateLoginRequest = loginUserRequest.parse(request.body);

        const user = await pool.query("SELECT email FROM users WHERE email = ?", [validateLoginRequest.email]);

        if (bcrypt.compare(validateLoginRequest.password, user.password)) {

            const token = jwt.sign({ "id": Number(user.id), "email": user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return response.cookie("token", token, { httpOnly: true }).json({ "message": "Logged in" });

        }
        
        return response.status(401).json({ "message": "Invalid credentials" });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return response.status(400).json({ "message": error.errors[0].message });
        }

        console.log(error);
    }
    return response.status(503).json({ "message": "Service unavailable" });   
});

export default router;