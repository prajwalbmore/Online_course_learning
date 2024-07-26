const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name:{type : String,require: true},
    description: {type: String},
    modules:[
        {
            moduleId : {type: String}
        }
    ]
})

module.exports = mongoose.model("course",courseSchema);  