import mongoose from "mongoose";

export async function connectDB() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        });

        connection.on('error', (error) => {
            console.error("MongoDB connection error:", error);
        });
        
        connection.on('disconnected', () => {
            console.log("MongoDB disconnected");
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
