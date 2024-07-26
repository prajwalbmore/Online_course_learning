const Course = require('../model/courseModel');
const Module = require('../model/moduleModel');

async function createCourse(req,res){
    try {
        const newCourse = new Course(req.body);
        const result = await newCourse.save();
        res.status(200).send({message :"Course created successfully",task : result});
    } catch (error) {
        res.status(500).send(error);
    }
} 
async function getAllCourse(req,res){
    try {
        
        result = await Course.find({},{__v:0});
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);

    }
}
async function updateCourse(req,res){

    try {
        const course = await Course.findByIdAndUpdate(req.params.id,req.body);
        if (!course) {
            res.status(400).send({message : 'Course not Found'});
        }
        res.status(200).send({message : 'Course updated'});
        } catch (error) {
            res.status(500).send(error);
    }
}

async function deleteCourse(req,res){
    const courseId = req.params.id;
    try {
        const course = await Course.findByIdAndDelete(courseId);
        if(!course){
            res.status(400).send({message : 'Course not found'});
        }
        res.status(200).send({message : 'Course Deleted',});
    } catch (error) { 
        res.status(500).send(error);
    }
} 

async function assignModule(req,res){
    try {
        const courseid = req.params.id;
        const course = await Course.findOne({ _id : courseid });
        if (!course) {
            res.status(404).send({ message: "Unknown courseid" });
        }else{
            
            const module1 = await Module.findById(req.body.moduleId);

            if(!module1){
                res.status(404).send({ message: "Unknown moduleId" });
            }else{
                course.modules.push(req.body.moduleId);
                
                const updateCourse = await course.save();
                if (updateCourse){
                    res.status(200).send(updateCourse);
                }
            }
        } 
          
    } catch (error) {
        res.status(500).send(error);  
    }
}

async function getCourseModule(req,res){
    try {
        const courseId = req.params.id;
        const course = await Course.findOne({_id : courseId},{modules:1});
        if(course){
            res.status(200).send(course);
        }else{
            res.status(404).send({ message: "Unknown userId" });
        }
    } catch (error) {
        res.status(500).send(error); 
    }
}

// async function updateCourseModule(req,res){
//     const courseId = req.params.id;
//     const moduleId = req.body.moduleId;
//     const newModuleId = req.body.newModuleId;
//     console.log(courseId,moduleId,newModuleId);
//     try { 
//         const course = await Course.findOne({_id : courseId});
//         // console.log(course)
//         const courseModules = course.modules;
//         console.log(courseModules)
//         let newList = await courseModules.filter(c => {
//             return c == moduleId;
//         });

//         const indexofModules = courseModules.indexOf(moduleId);
//         console.log(indexofModules)
//         courseModules = course.modules    
//         courseModules[indexofModules] = newModuleId;
//         console.log("***///",course.modules)
//         const updatedCourse = await course.save();
//         console.log("***",updatedCourse)
//         res.status(200).send({message : 'Module Updated',updatedCourse});
//     } catch (error) {
//         res.status(500).send(error); 
//     }
// }

async function updateCourseModule(req, res) {
    const courseId = req.params.id;
    const moduleId = req.body.moduleId;
    const newModuleId = req.body.newModuleId;
    console.log(courseId, moduleId, newModuleId);

    try {
        const course = await Course.findOne({ _id: courseId });
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        } 
        const module1 = await Module.findOne({_id:newModuleId});
        if(module1){
            const courseModules = course.modules;
        console.log(courseModules);

        const indexofModules = courseModules.indexOf(moduleId);

        // Use splice to replace the old moduleId with newModuleId
        courseModules.splice(indexofModules, 1, newModuleId);
        course.modules = courseModules;
        console.log("***///", course.modules);

        const updatedCourse = await course.save();
        console.log("***", updatedCourse);

        res.status(200).send({ message: 'Module Updated', updatedCourse });
        }else{
            res.status(404).send({message : 'invalid moduleId'});
        }
        
    } catch (error) {
        res.status(500).send(error);
    }
}



async function deleteCousreModules(req,res){
    const courseId = req.params.id;
    const moduleId = req.body.moduleId;
     try {
        const course = await Course.findOne({_id : courseId})
        const courseModuels = course.modules;
        
            console.log("***/",courseModuels.includes(moduleId));
        
        let newList = await courseModuels.filter(c => {
            return c != moduleId;
        });
         console.log(newList);
        course.modules = newList;
        const updatedCourse = await course.save();

        res.status(200).send(updatedCourse);
    } catch (error) {
        res.status(500).send(error); 
    }
}


module.exports = {
    createCourse,
    getAllCourse,
    updateCourse,
    deleteCourse,
    assignModule,
    getCourseModule,
    updateCourseModule,
    deleteCousreModules
}