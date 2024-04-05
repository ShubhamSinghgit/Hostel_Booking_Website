import { Router } from "express";
import {
  mainPage,
  aboutPage,
  contactPage,
  adminRegisterPage,
  adminLoginPage,
  studentRegisterPage,
  studenLoginPage,
  roombookingPage,
  viewComplain,
  Createcomplaine,
  deleteDataCom,
  adminRegister,
  adminLogin,
} from "../controllers/Fronted.controller.js";
import isLogIn from "../middlewares/isLogIn.js";

const FrontedRoute = Router();

FrontedRoute.get("/home", mainPage)
  .get("/about", aboutPage)
  .get("/contact", contactPage)
  .get("/viewadminregister", adminRegisterPage)
  .get("/viewadminlogin", adminLoginPage)
  .get("/viewregister", studentRegisterPage)
  .get("/viewlogin", studenLoginPage)
  .get("/book", roombookingPage)
  .get("/viewusercomplain/:id", viewComplain)
  .post("/complaine", Createcomplaine)
  .get("/delete/:E_no/:c_id", isLogIn, deleteDataCom)
  .post("/registeradmin", adminRegister)
  .post("/loginadmin", adminLogin);

export default FrontedRoute;
