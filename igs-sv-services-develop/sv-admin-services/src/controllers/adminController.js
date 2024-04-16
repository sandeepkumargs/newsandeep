//User Controller
import userService from "../services/adminService.js";

const getMaster = async (req, res) => {
  res.status(200).json(await userService.getMasterData());
}

const getemployeeshierarchy = async(req,res) => {
  console.log("in getemployeeshierarchy controller..");
  res.status(200).json(await userService.getemployeeshierarchy());
}

const getAnalytics = async(req,res) => {
  console.log("in getAnalytics controller..");
  res.status(200).json(await userService.getAnalytics());
}

export default { getAnalytics,getemployeeshierarchy, getMaster};