import UserModel from "../models/UserModel.js";
import { CollageData } from "../CollageData.js";

//Student Register
export const StudentRegister = async (req, res) => {
  try {
    const { E_no, password, cnf_password } = req.body;
    if (!E_no || !password || !cnf_password) {
      return res.render("error.ejs");
    }

    if (password !== cnf_password) {
      return res.render("error.ejs");
    }
    const id = Number(E_no);

    const collageStudent = CollageData.filter((e) => e.enrollmentNo === id);

    if (collageStudent.length === 0) {
      return res.render("error.ejs");
    }

    const existUser = await UserModel.findOne({ E_no: id });
    if (existUser) {
      return res.render("error.ejs");
    }

    const user = await new UserModel({
      name: collageStudent[0].name,
      email: collageStudent[0].email,
      E_no,
      password,
      ph_no: collageStudent[0].ph_no,
    });
    await user.save();
    if (!user) {
      return res.render("error.ejs");
    }
    const token = await user.JWT();

    res.cookie("token", token, {
      httpOnly: true,
    });

    const info = { success: true, data: user };
    return res.render("viewpage.ejs", {
      info,
    });
  } catch (e) {
    return res.render("error.ejs");
  }
};

//Student Login

export const StudentLogIn = async (req, res, next) => {
  try {
    const { E_no, password } = req.body;

    if (!E_no || !password) {
      return res.render("error.ejs");
    }

    const id = Number(E_no);

    const user = await UserModel.findOne({ E_no: id });

    if (!user) {
      return res.render("error.ejs");
    }

    const isTrue = await user.comparePassword(password);
    if (isTrue === false) {
      return res.render("error.ejs");
    }
    // console.log(user);

    const token = await user.JWT();
    res.cookie("token", token, {
      httpOnly: true,
    });

    const info = { success: true, data: user };
    // console.log(info);
    return res.render("viewpage.ejs", {
      info,
    });
  } catch (err) {
    console.log("Error in LogIn Part", err);
    return res.render("error.ejs");
  }
};

//Student Logout

export const StudentLogOut = (req, res) => {
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
