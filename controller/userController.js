const User = require('../model/userModel');
const Course = require('../model/courseModel');
const jwt = require('jsonwebtoken');

async function registerUser(req, res){
    newMobile = req.body.mobile ;
    try {
        const userExists = await User.findOne({mobile : newMobile});
        if(userExists){
            res.status(400).json({message : 'User already exists'})  
        }else{
            const user = new User(req.body);
            await user.save();
            res.status(201).json({message : 'Registration successful'})
        }
         
    } catch (error) {
        res.status(500).send(error);
    }
}

async function loginUser(req,res){
    try {
        newMobile = req.body.mobile;
        password = req.body.password;
        const user = await User.findOne({mobile : newMobile});

        if (!user) {
            res.status(400).send({ error : 'Invalid login credentials'});
        }
        isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).send({error : 'Password Incorrcet'});
        }
        const token = jwt.sign({_id : user._id},'prajwal',{expiresIn : '1h'});
        res.status(200).send({acessToken : token,task : user});

    } catch (error) {
        res.status(500).send(error);
    }
}


async function getAllUsers(req,res){
    try {
        result = await User.find({},{__v:0});
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function updateUser(req,res){

    try {
        const user = await User.findByIdAndUpdate(req.params.id,req.body);
        console.log(user);
        if (!user) {
            res.status(400).send({message : 'User not Found'});
        }
        res.status(200).send({message : 'User updated'});
        } catch (error) {
            res.status(500).send(error);
    }
}
async function deleteUser(req,res){
    
        const id = req.params.id;
        try {
            const user = await User.findByIdAndDelete(id);
            if(!user){
                res.status(400).send({message : 'User not found'});
            }
            res.status(200).send({message : 'User Deleted',user});
        } catch (error) { 
            res.status(500).send(error);
        }
    
}

async function assignCourse(req,res){
    try {
        const userid = req.params.id;
        const user = await User.findOne({ _id : userid });
        
        if (!user) {
            res.status(404).send({ message: "Unknown userId" });
        }else{
            
            const course = await Course.findById(req.body.courseId);

            if(!course){
                res.status(404).send({ message: "Unknown courseId" });
            }else{
                
                user.course.push(req.body.courseId);

                const updateUser = await user.save();
                if (updateUser){
                    res.status(200).send(updateUser);
                }
            }

        }           
    } catch (error) {
        res.status(500).send(error);  
    }
}


async function getUserCourse(req,res){
    try {
        const userId = req.params.id;

        const user = await User.findOne({_id : userId},{_id : 0, course : 1});
        
        if(user){
            res.status(200).send(user);
        }else{
            res.status(404).send({ message: "Unknown userId" });
        }
    } catch (error) {
        res.status(500).send(error); 
    }
}


async function updateUserCourse(req,res){
    const userId = req.params.id;
    const courseId = req.body.courseId;
    const newCourseId = req.body.newCourseId;
    try { 
        const user = await User.findOne({_id : userId});
        const userCourses = user.course;

        let newList = await userCourses.filter(c => {
            return c == courseId;
        });

        const indexofcourse = userCourses.indexOf(courseId);
        user.course =  userCourses[indexofcourse] = newCourseId;

        const updatedUser = await user.save();
        res.status(200).send({message : 'Course Updated',updatedUser});
    } catch (error) {
        res.status(500).send(error); 
    }
}


async function deleteUserCourse(req,res){
    const userId = req.params.id;
    const courseId = req.body.courseId;
     try {
        const user = await User.findOne({_id : userId})
        const userCourses = user.course;
        
        let newList = await userCourses.filter(c => {
            return c != courseId;
        });
        
        user.course = newList;
        const updatedUser = await user.save();

        res.status(200).send(updatedUser.course);
    } catch (error) {
        res.status(500).send(error); 
    }
}

module.exports = {
    registerUser,
    loginUser, 
    getAllUsers, 
    updateUser ,
    deleteUser ,
    assignCourse,
    getUserCourse,
    deleteUserCourse,
    updateUserCourse  
} 