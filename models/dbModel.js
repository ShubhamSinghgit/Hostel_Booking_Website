import mongoose, { model, mongo } from "mongoose";
import crypto from "crypto";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const UserSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      maxLength: [15, "length should be 15"],
      require: true,
      trim: true,
    },
    password: {
      type: String,
      maxLength: [5, "length should be 5"],
      require: true,
    },
    roomId: {
      type: Number,
    },
  },
  {
    timeStamp: true,
  }
);
UserSchema.pre("save", async function () {
  const pass = await bcrypt.hash(this.password, 10);
  this.password = pass;
});

UserSchema.methods = {
  JWT: function () {
    // const secretKey = crypto.randomBytes(32).toString("base64");
    // this.secret = secretKey;
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
};

const UserModel = model("Students", UserSchema);
export default UserModel;
