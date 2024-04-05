import UserModel from "../models/UserModel.js";
import AdminModel from "../models/AdminModel.js";
import { AdminData } from "../AdminData.js";

export const mainPage = (req, res) => {
  res.render("index.ejs");
};

export const aboutPage = (req, res) => {
  res.render("about.ejs");
};

export const contactPage = (req, res) => {
  res.render("contact.ejs");
};

export const bookingPage = async (req, res) => {
  res.render("booking.ejs");
};

export const adminLoginPage = (req, res) => {
  res.render("admin_login.ejs");
};

export const adminRegisterPage = (req, res) => {
  res.render("admin_register.ejs");
};

export const viewComplainPage = async (req, res) => {
  const datas = await getDataFromComplaine(req.params);
  res.render("complain.ejs", { data: datas.data, id: datas.id });
};

export const studentRegisterPage = (req, res) => {
  res.render("student_register.ejs");
};

export const studenLoginPage = (req, res) => {
  res.render("login.ejs");
};

export const roombookingPage = async (req, res) => {
  res.render("booking.ejs");
};

export const viewComplain = async (req, res) => {
  const ids = Number(req.params.id);

  const user = await UserModel.findOne({ E_no: ids });
  if (!user) {
    return res.render("error.ejs", {
      message: "Error in getting the complain",
    });
  }
  res.render("complain.ejs", { data: user, id: user.E_no });
};

export const Createcomplaine = async (req, res) => {
  const id = req.body.E_no;

  const { complain_type, description } = req.body;
  if (!complain_type || !description) {
    return res.render("erroe.js");
  }

  const user = await UserModel.findOne({ E_no: id });

  if (!user) {
    return res.render("erroe.js");
  }

  let newComplain = {
    complain_type,
    description,
  };

  user.complains.push(newComplain);
  await user.save();
  res.redirect(`/viewusercomplain/${id}`);
};

export const deleteDataCom = async (req, res) => {
  console.log("Param", req.params);
  const paramId = req.params;
  const { id } = req.user;
  // console.log("tokenId", id);
  console.log(Number(paramId.E_no) === id);
  if (Number(paramId.E_no) !== id) {
    return res.render("error.ejs");
  }
  const complainUser = await UserModel.findOne({ E_no: id });

  const newComplain = complainUser.complains.filter((e) => {
    // console.log(e._id.toHexString() !== paramId.c_id);
    return e._id.toHexString() !== paramId.c_id;
  });
  // console.log(newComplain);
  complainUser.complains = [...newComplain];
  await complainUser.save();

  res.redirect(`/viewusercomplain/${req.params.E_no}`);
};

export const adminRegister = async (req, res) => {
  try {
    const { E_no, password, confirmpass } = req.body;
    console.log(req.body);
    if (!E_no || !password || !confirmpass) {
      return res.render("error.ejs");
    }
    console.log(password !== confirmpass);
    if (password !== confirmpass) {
      return res.render("error.ejs");
    }
    const id = Number(E_no);

    //Checking The Admin is Registerd or not
    const collageAdmin = AdminData.filter((e) => e.enrollmentNo === id);
    console.log(collageAdmin);
    if (collageAdmin.length === 0) {
      return res.render("error.ejs");
    }
    const existUser = await AdminModel.findOne({ E_no: id });
    if (existUser) {
      return res.render("error.ejs");
    }

    const user = await new AdminModel({
      name: collageAdmin[0].name,
      email: collageAdmin[0].email,
      E_no,
      password,
      ph_no: collageAdmin[0].ph_no,
    });
    await user.save();
    if (!user) {
      return res.render("error.ejs");
    }
    const token = await user.JWT();

    res.cookie("token", token, {
      httpOnly: true,
    });

    const newData = await UserModel.find({});

    return res.render("admin_complain.ejs", { newData });
  } catch (err) {
    return res.render("error.ejs");
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { E_no, password } = req.body;
    const id = Number(E_no);

    const user = await AdminModel.findOne({ E_no: id });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not Found",
      });
    }
    const isTrue = await user.comparePassword(password);
    console.log(isTrue);
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

    const newData = await UserModel.find({});
    console.log(newData);

    res.render("admin_complain.ejs", { newData });
  } catch (err) {
    console.log("Error in LogIn Part", err);
    return res.status(400).send({
      success: false,
      message: "LogIn Server is Not Working",
    });
  }
};
