// Packages that will be used:
// npm i init
// npm i express
// npm i cors
// npm i dotenv
// npm i nodemon
// npm i jsonwebtoken
// npm i mongoose
// npm i bcryptjs
// npm i nodemailer
// npm i cookie-parser

// IN package.json 
  // To use import and export statement in project
//   "type":"module", 


// ----------------------------Importing packages ----------------------------------
import express from "express";
import cors from "cors";
import "dotenv/config"; // automatically loads .env

// Option 2: Using import and explicit config
// import dotenv from "dotenv";
// dotenv.config(); // explicitly load .env

import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";

import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = ['http://localhost:5173']
app.use(cors({origin: allowedOrigins, credentials:true})); // to send cookies in response and to allow communication between different ports we have to give origins

// API ENDPOINTs
app.get("/",(req,res)=>{
    res.send("Hell0");
});

app.use('/api/auth',authRouter)

app.use('/api/user',userRouter)

app.listen(port,()=>{
    console.log(`App is running on server ${port}.`)
})

// In package.json
    // under scripts:{
        // "start":"node server.js",
        // "server":"nodemon server.js"
    // }

// Connecting to MongoAtlas and go to network access and delete all IP Access list and add allow access from anywhere (given an option)
// Create new folder config in server and create a file mongodb.js
//Create new .env file inside server folder and add url of mongodb cluster and port.

// Now add model in models folder
// Now create controllers folder and inside it create authController.js file and follow it.
// Add new routes inside API ENDPOINTs

// Now use postman to test : http://localhost:3000/api/auth/regster, http://localhost:3000/api/auth/login and http://localhost:3000/api/auth/logout
// raw:
// {
//     "name": "Rohit",
//     "email": "rohetbiswash@gmail.com",
//     "password": "123456"
// }
// header:
// Content-Type: application/json


// Go to config and and create nodemailer.js file once all done, test register route again to check whether you receive email or not.

// Just added a new route api/user
// Test it in postman and now work on frontend using react
