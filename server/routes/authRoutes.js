import express from 'express';
import { login, logout, register, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);

// app = your main house 🏠 (the whole application)
// router = individual rooms 🚪 (each router handles part of the app, e.g., auth, users, students, etc.)
// Suppose there’s a home route / handled by app — that means it’s part of the main server created using const app = express(). But if you have routes like /auth/login or /auth/register, you can group them in a separate router using express.Router(). Then you connect it to the main app using app.use('/auth', authRouter).


authRouter.post('/send-verify-otp',userAuth, sendVerifyOtp);
// HEre due to next() the data will be send to sendVerifyOtp
authRouter.post('/verify-account',userAuth, verifyEmail);

export default authRouter;
// Now go to server.js file and import it

// After adding verification routes Now test the new routes in postman 