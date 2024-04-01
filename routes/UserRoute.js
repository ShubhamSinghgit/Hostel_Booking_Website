import { Router } from "express";
import { LogIn, Register, LogOut } from "../controllers/User.controller.js";
import isLogIn from "../middlewares/isLogIn.js";
import isToken from "../middlewares/isToken.js";

const UserRoute = Router();

UserRoute.post("/register", Register)
  .post("/user/login", LogIn)
  .get("/logout", isLogIn, LogOut);

export default UserRoute;
