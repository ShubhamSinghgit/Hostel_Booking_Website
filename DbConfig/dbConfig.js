import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    if (connect) {
      console.log(`DataBase is Conneccted : ${connect.connection.host}`);
    }
  } catch (e) {
    console.log("Some error is in Mongo Connection", e);
  }
};

export default dbConnection;
