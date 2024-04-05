import mongoose, { model } from "mongoose";
const ComplainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    E_no: {
      type: Number,
      minLength: [15, "minimum length is 15"],
      require: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    roomId: {
      type: Number,
    },
    complains: [
      {
        complain_type: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
    ph_no: {
      type: String,
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timeStamp: true,
  }
);

const ComplainModel = model("complains", ComplainSchema);
export default ComplainModel;
