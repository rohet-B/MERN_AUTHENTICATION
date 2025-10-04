import express from 'express';
import { login, logout, register } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);

// app = your main house 🏠 (the whole application)
// router = individual rooms 🚪 (each router handles part of the app, e.g., auth, users, students, etc.)
// Suppose there’s a home route / handled by app — that means it’s part of the main server created using const app = express(). But if you have routes like /auth/login or /auth/register, you can group them in a separate router using express.Router(). Then you connect it to the main app using app.use('/auth', authRouter).

export default authRouter;
// Now go to server.js file and import it