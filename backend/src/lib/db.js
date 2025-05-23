import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `Connected to mongodb successfully: ${connect.connection.host}`
    );
  } catch (error) {
    console.log("Error in connecting mongodb", error);
  }
};

export default connectDB;
