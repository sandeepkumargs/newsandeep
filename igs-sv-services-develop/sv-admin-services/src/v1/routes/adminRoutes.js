/*
 * Routes defined for admin
 */
import express from "express";
import adminController from "../../controllers/adminController.js";
const adminRouter = express.Router();

adminRouter.get("/hierarchy",adminController.getemployeeshierarchy);
adminRouter.get("/analytics",adminController.getAnalytics);
adminRouter.get("/")

export default adminRouter;