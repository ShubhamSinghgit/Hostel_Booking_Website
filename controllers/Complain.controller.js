import ComplainModel from "../models/ComplainModel.js";
import UserModel from "../models/UserModel.js";

export const createComplain = async (req, res, next) => {
  try {
    const paramId = req.params;
    const { id } = req.user;
    if (Number(paramId.id) !== id) {
      return res.status(500).send({
        success: false,
        message: "User not Found",
      });
    }
    const { complain_type, description } = req.body;
    if (!complain_type || !description) {
      return res.status(400).send({
        success: false,
        message: "All fields are require",
      });
    }

    const user = await UserModel.findOne({ E_no: id });

    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not Found",
      });
    }
    let newComplain = {
      complain_type,
      description,
    };
    const compalinUser = await ComplainModel.findOne({ E_no: id });
    if (compalinUser) {
      compalinUser.complains.push(newComplain);
      await compalinUser.save();
      return res.status(200).send({
        success: true,
        message: "All Done",
        data: {
          compalinUser,
        },
      });
    }
    const newComplianUser = new ComplainModel({
      name: user.name,
      email: user.email,
      ph_no: user.ph_no,
      E_no: user.E_no,
      complains: [newComplain],
    });
    await newComplianUser.save();

    return res.status(200).send({
      success: true,
      message: "All Done",
      data: {
        newComplianUser,
      },
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "Sign in Server is Not Working",
    });
  }
};

export const GetAllComplain = async (req, res, next) => {
  try {
    const allComplaine = await ComplainModel.find({});
    if (!allComplaine) {
      return res.status(300).send({
        success: false,
        message: "Somthing Wrong on db",
      });
    }

    res.status(201).send({
      success: true,
      message: "Successfully get Data",
      allComplaine,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Somthing wrong on getallcomplain controller",
    });
  }
};

export const deleteComplain = async (req, res, next) => {
  try {
    const paramId = req.params;
    const { id } = req.user;
    if (Number(paramId.id) !== id) {
      return res.status(500).send({
        success: false,
        message: "User not Found",
      });
    }
    const complainUser = await ComplainModel.findOne({ E_no: id });
    if (complainUser.complains.length == 1) {
      await ComplainModel.deleteOne({ E_no: id });
      return res.status(200).send({
        success: true,
        message: "SuccesssFully deleted",
      });
    }

    const newComplain = complainUser.complains.filter((e) => {
      console.log(e._id.toHexString() !== paramId.c_id);
      return e._id.toHexString() !== paramId.c_id;
    });
    console.log(newComplain);
    complainUser.complains = [...newComplain];
    await complainUser.save();

    return res.status(200).send({
      success: true,
      message: "SuccesssFully deleted",
      complainUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "Somthing wrong on deletecomplain controller",
    });
  }
};
