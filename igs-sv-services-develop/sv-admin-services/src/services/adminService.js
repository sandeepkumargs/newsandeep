// User Service Layer

import adminDb from "../database/adminDb.js";

const updateUser = async (id,doc) => {
  return await adminDb.updateUser(id,doc);
};

const getemployeeshierarchy = async() =>{
  const hierarchy =  await adminDb.getHierarchyMaster(); 
  console.log("got heirarchy..",hierarchy);

  try{
    // Extracting Progression values into a single array
    const allProgressions = hierarchy["Hierarchy Progression"].flatMap(entry => {
      if (Array.isArray(entry.Progression)) {
        // Handling case where Progression is an array
        return entry.Progression.flatMap(progression => Object.values(progression));
      } else {
        // Handling case where Progression is an object
        return Object.values(entry.Progression);
      }
    });
    console.log("all progressions ", allProgressions);
    //get employees for all progressions
    //key :"designation"
    //value : count
    return adminDb.getEmpDesignationCount(allProgressions);
    //return allProgressions;

  }catch(err){
    console.log("err in srv getempheir ",err);
    return null;
  }
}

const getAnalytics = async () =>{
  return await adminDb.getAnalytics();
}

export default {getAnalytics,updateUser,getemployeeshierarchy}