import AdminModel from "../models/AdminModel.js";
import { AdminData } from "../AdminData.js";

export const AdminRegister = async (req, res) => {
  try {
    //Checking all fields from Frontend
    const { E_no, password } = req.body;
    if (!E_no || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are require",
      });
    }

    //Checking The Admin is Registerd or not
    const collageAdmin = AdminData.filter((e) => e.enrollmentNo === E_no);
    if (collageAdmin.length === 0) {
      return res.status(401).send({
        success: true,
        message: "You are not a collage Admin",
      });
    }

    //Checking the Admin is already exist or not
    const existUser = await AdminModel.findOne({ E_no });
    if (existUser) {
      return res.status(500).send({
        success: false,
        message: "User Already existed",
      });
    }

    //Register Admin
    const user = await new AdminModel({
      name: collageAdmin[0].name,
      email: collageAdmin[0].email,
      E_no,
      password,
      ph_no: collageAdmin[0].ph_no,
    });
    await user.save();
    if (!user) {
      return res.status(500).send({
        success: true,
        message: "Admin data is not save",
      });
    }
    const token = await user.JWT();

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(200).send({
      success: true,
      message: "Admin is successfully Registered",
      data: {
        user,
      },
    });
  } catch (e) {
    res.status(400).send({
      success: false,
      message: "Sign in Server is Not Working",
    });
    console.log("Error in Register Part", e);
  }
};

//Admin Login

export const AdminLogIn = async (req, res, next) => {
  try {
    const { E_no, password } = req.body;

    const user = await AdminModel.findOne({ E_no });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "Admin not Found",
      });
    }
    const isTrue = await user.comparePassword(password);
    if (!isTrue) {
      return res.status(400).send({
        success: false,
        message: "Wrong Passsword",
      });
    }

    const token = await user.JWT();
    res.cookie("token", token, {
      httpOnly: true,
    });

    user.password = undefined;

    res.status(200).send({
      success: true,
      message: "Admin is successfully log in",
      user,
    });
  } catch (err) {
    console.log("Error in LogIn Part", err);
    return res.status(400).send({
      success: false,
      message: "LogIn Server is Not Working",
    });
  }
};

//Admin Logout

export const AdminLogOut = (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).send({
        success: false,
        message: "token  is alredy removed",
      });
    }
    res.cookie("token", token, { maxAge: 0 });
    return res.status(200).send({
      success: true,
      message: "Admin is successfully signed out",
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
