import jwt from "jsonwebtoken";

const isToken = (req, res, next) => {
  try {
    const { token } = req.cookies;
    console.log("Token is :", token);
  } catch (err) {
    console.log("IsToken problem", err);
  }
  return;
  //   next();
};

export default isToken;
