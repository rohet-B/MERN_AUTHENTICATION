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

const app = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true})); // to send cookies in response

app.listen(port,()=>{
    console.log(`App is running on server ${port}.`)
});
app.get("/",(req,res)=>{
    res.send("Hell0");
});

// In package.json
    // under scripts:{
        // "start":"node server.js",
        // "server":"nodemon server.js"
    // }

// Connecting to MongoAtlas and go to network access and delete all IP Access list and add allow access from anywhere (given an option)
// Create new folder config in server and create a file mongodb.js
//Create new .env file inside server folder and add url of mongodb cluster and port.

// Now add model in models folder
// Now create controllers folder