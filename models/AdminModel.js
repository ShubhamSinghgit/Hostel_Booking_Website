import mongoose, { model } from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const AdminSchema = new mongoose.Schema(
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
    password: {
      type: String,
      minLength: [5, "min length is 5"],
      require: true,
    },
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
AdminSchema.pre("save", async function () {
  const pass = await bcrypt.hash(this.password, 10);
  this.password = pass;
});

AdminSchema.methods = {
  JWT: function () {
    const token = Jwt.sign(
      {
        id: this.id,
        password: this.password,
      },
      process.env.SEC,
      {
        expiresIn: "1h",
      }
    );
    return token;
  },
  comparePassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
};

const AdminModel = model("Admin", AdminSchema);
export default AdminModel;
