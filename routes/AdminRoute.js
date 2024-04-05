import { Router } from "express";
import {
  AdminLogIn,
  AdminLogOut,
  AdminRegister,
} from "../controllers/Admin.controller.js";
import isLogIn from "../middlewares/isLogIn.js";
import { GetAllComplain } from "../controllers/Complain.controller.js";

const AdminRoute = Router();

AdminRoute.post("/register", AdminRegister)
  .post("/login", AdminLogIn)
  .get("/logout", isLogIn, AdminLogOut)
  .get("/allcomplain", isLogIn, GetAllComplain);

export default AdminRoute;
