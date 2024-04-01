import UserModel from "../models/dbModel.js";
import { CollageData } from "../CollageData.js";
import bcrypt from "bcrypt";

export const Register = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are require",
      });
    }

    const collageStudent = CollageData.filter((e) => e.enrollmentNo === id);
    if (collageStudent.length === 0) {
      return res.status(401).send({
        success: true,
        message: "You are not a coolage student",
      });
    }

    const existUser = await UserModel.findOne({ id });
    if (!existUser) {
      const user = await new UserModel({ id, password });
      await user.save();
      if (!user) {
        return res.status(500).send({
          success: true,
          message: "User data is not save",
        });
      }
      const token = await user.JWT();

      res.cookie("token", token, {
        httpOnly: true,
      });

      return res.status(200).send({
        success: true,
        message: "User is successfully saved",
        data: {
          user,
        },
      });
    }

    return res.status(500).send({
      success: false,
      message: "User Already existed",
    });
  } catch (e) {
    res.status(400).send({
      success: false,
      message: "Sign in Server is Not Working",
    });
    console.log("Error in Register Part", e);
  }
};

export const LogIn = async (req, res, next) => {
  try {
    const { id, password } = req.body;

    const user = await UserModel.findOne({ id });
    if (!user) {
      res.status(500).send({
        success: false,
        message: "User not Found",
      });
    }
    const cheackPassword = await bcrypt.hash(password, user.password);
    console.log(user.password);

    if (!cheackPassword) {
      return res.status(400).send({
        success: false,
        message: "Wrong Passsword",
      });
    }
    // user.select("+passwoed");

    const token = await user.JWT();
    res.cookie("token", token, {
      httpOnly: true,
    });

    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "User is successfully log in",
      user,
    });

    // next();
  } catch (err) {
    console.log("Error in LogIn Part", err);
    return res.status(400).send({
      success: false,
      message: "LogIn Server is Not Working",
    });
  }
};

export const LogOut = async function (req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).send({
        success: false,
        message: "token  is alredy removed",
      });
    }
    res.cookie("token", token, { maxAge: 0 });

    res.status(304).send({
      success: true,
      message: "User is successfully signed out",
    });
    // res.status(200);
  } catch (e) {
    console.log("Error in signOut part", e);
    return res.status(400).send({
      success: false,
      message: "Signout Server is Not Working",
    });
  }
};
