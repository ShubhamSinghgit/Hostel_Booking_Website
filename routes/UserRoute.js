import { Router } from "express";
import {
  StudentLogIn,
  StudentRegister,
  StudentLogOut,
} from "../controllers/User.controller.js";
import isLogIn from "../middlewares/isLogIn.js";
import {
  createComplain,
  deleteComplain,
} from "../controllers/Complain.controller.js";

const UserRoute = Router();

UserRoute.post("/register", StudentRegister)
  .post("/login", StudentLogIn)
  .get("/logout", isLogIn, StudentLogOut);

export default UserRoute;
