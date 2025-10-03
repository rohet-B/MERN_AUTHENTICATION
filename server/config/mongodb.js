import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/mern-auth`);
    // you’re connecting to the database named mern-auth inside your MongoDB cluster.
    console.log("Database Connected"); // prints when connection is successful
  } 
  catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectDB;
