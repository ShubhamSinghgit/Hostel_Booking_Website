import Jwt from "jsonwebtoken";

const isLogIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(400).send({
        success: false,
        message: "You are not log in",
      });
    }
    const decode = await Jwt.verify(token, process.env.SEC);
    req.user = decode;

    return next();
  } catch (e) {
    console.log("Erroe is in IsLogIN part");
  }
};

export default isLogIn;
