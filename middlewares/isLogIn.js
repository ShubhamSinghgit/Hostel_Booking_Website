import Jwt from "jsonwebtoken";

const isLogIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    // console.log(token);
    if (token) {
      const { id } = await Jwt.verify(token, process.env.SEC);
      if (req.body.id !== id) {
        return res.status(401).send({
          success: false,
          message: "Please Check your id",
        });
      }

      return res.status(401).send({
        success: false,
        message: "You are already LogIn",
      });
    }

    return next();
  } catch (e) {
    console.log("Erroe is in IsLogIN part");
  }
};

export default isLogIn;
