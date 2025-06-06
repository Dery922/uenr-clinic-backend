import {Router} from "express";
import { getDashboard } from "../Controllers/dashboard.js";
import { getDepartment } from "../Controllers/department.js";
import { createDepartment } from "../Controllers/department.js";
import { createUser, getlogin } from "../Controllers/auth.js";


const router = Router();

router.get("/", getDashboard);
router.get("/departments",getDepartment);
router.post("/create/departments", createDepartment);
router.get("/login", getlogin);
router.post("/createUser", createUser);


export default router;