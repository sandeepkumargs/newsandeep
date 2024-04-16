import { MongoClient,ServerApiVersion,ObjectId } from "mongodb";
import 'dotenv/config';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URI,  {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

// Test Ping with the Db - Could be 1 db for 1 Microservice
async function testPing() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
testPing().catch(console.dir);

async function getMasterData() {
    try{
        await client.connect();
        const coll = client.db(process.env.DB_NAM).collection(process.env.CL_MAS);
        const result = await coll.findOne();
        console.log(result);
        return result;
    } finally{
        await client.close()
    }
}

async function getMaster(){
    try{
        await client.connect();
        const coll = client.db(process.env.DB_NAM).collection(process.env.CL_MAS);
        const result = await coll.findOne({});
        return result;
    }catch(err){
        console.log("error ",err);
    }finally{
        await client.close()
    }
}

async function getUsers() {
    try{
        await client.connect();
        const coll = client.db(process.env.DB_NAM).collection(process.env.CL_EMP);
        const result = await coll.find({});
        const bob = await result.toArray();
        return bob;
    } finally{
        await client.close()
    }
}

async function getHierarchyMaster(){
    try{
        await client.connect();
        const coll = client.db(process.env.DB_NAM).collection(process.env.CL_HIE);
        const result = await coll.findOne();
        return result;
    }catch{
        return null;
    }finally {
        await client.close();
    }
}

async function getEmpDesignationCount(designationArray){
    try{
        await client.connect();
        const coll = client.db(process.env.DB_NAM).collection(process.env.CL_EMP);
        const empCounts = [];
        designationArray = designationArray.filter(element=>element!=="m1" && element !=="m2");
        for(var i=0;i<designationArray.length;i++){
            const empDesignation={};   
            const filter = {"skills_master.user.details.designation.name":designationArray[i]}; 
            const count = await coll.countDocuments(filter);
            empDesignation[designationArray[i]]=count;
            empCounts.push(empDesignation);
        }
        return empCounts;        
    }catch(err){
        console.log("error in db ",err);
        return null;
    }finally{
        client.close();
    }
}

async function getAnalytics(){
    try{
        const analyticsObj = await calculateAnalytics();
        if (analyticsObj){
            await client.connect();
            console.log("updating analytics..", "{a_id:1}");
            const coll = client.db(process.env.DB_NAM).collection(process.env.CL_NAL);
            const result = await coll.replaceOne({"a_id":"1"},analyticsObj,{upsert:true});
            console.log("finishied updating with status ",result);
            await client.close();
            return analyticsObj;
        }
        return null;
    }catch(err){
        console.log(err);
        return null;
    }
}


async function calcCategoryAggregates(masterDb,empDb){
    try{
        var skillsCatList = [];
        var skillsList = [];
        masterDb.categories.forEach(masterCategory =>{
            // console.log("Iterating master category ",masterCategory.name);
            masterCategory["sub-category"].forEach(masterSubCat =>{ 
                var skillsSubCatList = [];
                var scskillsList = [];
                // console.log("Iterating master sub cateogory ",masterSubCat.name);
                masterSubCat.concern.forEach(skillName =>{
                    console.log("skill name ",skillName);
                    var sc_skill_score = 0;
                    var sc_skill_total = 0;
                    var skillObj = {
                        skill_total:0,
                        skill_score:0,
                        skill_name:skillName,
                        skill_sc:masterSubCat.name,
                        skill_c:masterCategory.name,
                    };
                    empDb.forEach(employee =>{
                        const skill = employee?.skills_master?.categories.find(cat =>cat.name===masterCategory.name)
                        ?.["sub-category"].find(sc => sc?.name===masterSubCat?.name)?.concern.find(con => con?.name===skillName);        
                        skillObj.skill_total += 4;
                        skillObj.skill_score += skill.score;        
                        sc_skill_score+=skill.score;
                        sc_skill_total+=skill.total;
                    });
                    skillsList.push(skillObj);
                    scskillsList.push(skillObj);
                });
                var existsObjCategory = skillsCatList.find(category=>category.name===masterCategory.name);
                if (!existsObjCategory){     
                    //add sub-category object to category List
                    var subcatObj = new Object({
                        name:masterSubCat.name,
                        total_score:scskillsList.reduce((acc,cur) => acc + parseInt(cur?.skill_total),0),
                        my_score:scskillsList.reduce((acc,cur) => acc + parseInt(cur?.skill_score),0),
                        skills:scskillsList
                    });         
                    const catObj = new Object({
                        name:masterCategory.name,
                        total_score:scskillsList.reduce((acc,cur) => acc + parseInt(cur?.skill_total),0),
                        my_score:scskillsList.reduce((acc,cur) => acc + parseInt(cur?.skill_score),0),
                        sub_category:[]
                    });
                    catObj.sub_category.push(subcatObj);
                    skillsCatList.push(catObj);
                }else{
                    //fetch category object and add the new sub-category
                    var subcatObj = new Object({
                        name:masterSubCat.name,
                        total_score:scskillsList.reduce((acc,cur) => acc + parseInt(cur?.skill_total),0),
                        my_score:scskillsList.reduce((acc,cur) => acc + parseInt(cur?.skill_score),0),
                        skills:scskillsList
                    });         
                    //add all sub-category total for category object
                    existsObjCategory.sub_category.push(subcatObj);
                    for(var i=0;i<skillsCatList.length;i++){
                        if(skillsCatList[i].name===existsObjCategory.name){
                            skillsCatList[i] = existsObjCategory;
                            skillsCatList[i].total_score = skillsCatList[i].sub_category.reduce((acc,cur) => acc+
                                                           parseInt(cur.total_score),0)
                            skillsCatList[i].my_score = skillsCatList[i].sub_category.reduce((acc,cur)=> acc+
                                                           parseInt(cur.my_score),0)
                        }
                    }
                }
            });
            
        });

        return await skillsCatList;

    }catch(err){
        console.log("Error in calcTopScore ",err);
        return null;
    }
}

    async function calculateAnalytics(){
        try{
            const masterDb = await getMaster();
            const empDb = await getUsers();
            var categoryAggregates = await calcCategoryAggregates(masterDb,empDb);
            const lstActExp = await getChartData(empDb, masterDb);
            const certificates = await getCertificationAgg(masterDb,empDb);
            const topSkills = await getTopSkills(lstActExp);
            const analyticsObj = {
                "a_id":"1",
                "top_5_skills":topSkills,
                "chart_ac_ex_data":lstActExp,
                "certification_aggregates": certificates,
                "category_aggregates":categoryAggregates,
                "last_updated":Date.now()
            }
            return analyticsObj;
        }catch(err){
            console.log("error ",err);
            return null;
        }finally{
            await client.close();
        }
    }
    
    async function getChartData(empDb, masterDb) {
        const allUsersJson = await JSON.parse(JSON.stringify(empDb));
        const lstActExp = [];
        const totalCategories = masterDb?.categories;

        for (var i = 0; i < totalCategories.length; i++) {
            const objActExp = new Object({
                "name": "",
                "total_score": 0.0,
                "actual_score": 0.0
            });
            objActExp.name = totalCategories[i].name;
            //console.log("Interating Category :",objActExp.name);
            let total_score = 0.0;
            let actual_score = 0.0;
            for (var j = 0; j < allUsersJson.length; j++) {
                let cat = allUsersJson[j]?.skills_master?.categories.filter(userCategory => {
                    if (userCategory.name.trim() === objActExp.name.trim()) {
                        return userCategory;
                    }
                });
                if (cat[0]) {
                    cat = cat[0];
                }
                if (cat) {
                    //console.log("cat is ",cat.my_score);
                    if (cat?.total_score) {
                        total_score += parseFloat(cat?.total_score);
                    } else {
                        total_score += 0;
                    }
                    if (cat?.my_score) {
                        actual_score += parseFloat(cat?.my_score);
                    } else {
                        actual_score += 0;
                    }
                }
            }
            objActExp.total_score = total_score;
            objActExp.actual_score = actual_score;
            lstActExp.push(objActExp);
            total_score = 0.0;
            actual_score = 0.0;
        }
        return lstActExp;
    }
    
    async function getCertificationAgg(masterDb,empDb){
        const certifications = masterDb?.certifications;
        let allCertificates = [];
        for(var i=0;i<certifications.length;i++){
            const empCertificate = {
                "name":certifications[i].c_name,
                "total":empDb.length,
                "actual":0,
                "percentage":0.0
            };
            for(var j=0;j<empDb.length;j++){
                const my_certificate = empDb[j].skills_master.certifications.filter(cert =>{
                    if(cert.c_name===certifications[i].c_name){
                        return cert;        
                    }
                });
                //console.log("my_certification ",my_certificate);
                if(my_certificate[0]){
                    empCertificate.total = empDb.length;
                    if (my_certificate[0].acquired){
                        empCertificate.actual+=1;
                    }
                }
            }
            empCertificate.percentage=(empCertificate.actual/empCertificate.total)*100;
            allCertificates.push(empCertificate);
        }
        return allCertificates;
    }
    
    async function getTopSkills(lstActExp){
        const lstTopSkills = [];
        for(var i=0;i<lstActExp.length;i++){
            var skillObj = {
                "rank":1,
                "name":lstActExp[i].name,
                "percentage":((lstActExp[i].actual_score/lstActExp[i].total_score)*100).toFixed(2)
            }
            lstTopSkills.push(new Object(skillObj));
        }
        lstTopSkills.sort((a,b)=> b.percentage - a.percentage);
        lstTopSkills.forEach((obj,index)=>{
            obj.rank = index+1;
        });
        return await lstTopSkills;
    }

export default {getAnalytics,getEmpDesignationCount,getHierarchyMaster, testPing,getMasterData};