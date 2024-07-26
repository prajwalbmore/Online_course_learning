const Module = require('../model/moduleModel');
const Lecture = require('../model/lectureModel');

async function createModule(req,res){
    try {
        const newModule = new Module(req.body);
        const result = await newModule.save();
        res.status(200).send({message :"Module created successfully",task : result});
    } catch (error) {
        res.status(500).send(error);
    }
} 
async function getAllModule(req,res){
    try {
        result = await Module.find({},{__v:0});
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);

    }
}
async function updateModule(req,res){

    try {
        const newModule = await Module.findByIdAndUpdate(req.params.id,req.body);
        if (!newModule) {
            res.status(400).send({message : 'Module not Found'});
        }
        res.status(200).send({message : 'Module updated'});
        } catch (error) {
            res.status(500).send(error);
    }
}

async function deleteModule(req,res){
    const id = req.params.id;
    try {
        const newModule = await Module.findByIdAndDelete(id);
        if(!newModule){
            res.status(400).send({message : 'Module not found'});
        }
        res.status(200).send({message : 'Module Deleted',});
    } catch (error) { 
        res.status(500).send(error);
    }
} 


async function assignlecture(req,res){
    try {
        const moduleId = req.params.id;
        const module1 = await Module.findOne({ _id : moduleId });
        
        if (!module1) {
            res.status(404).send({ message: "Unknown moduleId" });
        }else{
            
            const lecture = await Lecture.findById(req.body.lectureId);

            if(!lecture){
                res.status(404).send({ message: "Unknown lectureId" });
            }else{
                
                module1.lectures.push(req.body.lectureId);

                const updateModule = await module1.save();
                if (updateModule){
                    res.status(200).send(updateModule);
                }
            }

        }           
    } catch (error) {
        res.status(500).send(error);  
    }
}

async function getModuleLectures(req,res){
    try {
        const moduleId = req.params.id;
        const module1 = await Module.findOne({_id : moduleId},{_id : 0,lectures : 1});
        
        if(module1){
            res.status(200).send(module1);
        }else{
            res.status(404).send({ message: "Unknown userId" });
        }
    } catch (error) {
        res.status(500).send(error); 
    }
}
 

module.exports = {
    createModule,
    getAllModule,
    updateModule,
    deleteModule,
    assignlecture,
    getModuleLectures
}