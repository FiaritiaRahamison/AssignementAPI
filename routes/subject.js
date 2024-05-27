const {SubjectModel:Subject} = require('../model/subject');
const { UserModel:User } = require('../model/user');
const ROLES = require('../utils/enums');
const responde = require('../utils/generalResponse');

const getTeacher = async (id)=>{
    try {
        const user = await User.findById(id);
        
        if(!user || user.role != ROLES.teacher){
            throw new Error("Teacher not found");
        }
        return user;
    } catch (error) {
        throw error;
    }
}


async function getSubjects(req, res){

    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    let aggregateOptions =[];
    if(req.user.role == ROLES.teacher){
        aggregateOptions =[{$match : {
            "teacher._id" : req.user._id
        }}]
    }
    let aggregateQuery = Subject.aggregate(aggregateOptions);

    Subject.aggregatePaginate(
        aggregateQuery, 
        {
            page: page,
            limit: limit
        },
        (err, data) => {
            if(err){
                console.log(err)
                res.status(400).json(responde({},err.message))
            }else{
                res.status(201).json(responde(data));
            }
        }
    );
}

async function getSubject(req, res){
    let subjectId = req.params.id;
    Subject.findById(subjectId, (err, subject) =>{
        if(err){
            console.log(err)
            res.status(400).json(responde({},err.message))
        }else{
            res.status(201).json(responde(subject));
        }
    })
}

async function postSubject(req, res) {
    
    try {
        const teacher = await getTeacher(req.body.teacher); 
        const newSubject = new Subject({
            name: req.body.name,
            photo: req.body.photo,
            teacher: teacher
        });
        const savedSubject = await newSubject.save();
        res.status(201).json(responde(savedSubject));
    } catch (err) {
        console.log(err);
        res.status(400).json(responde({},err.message));
    }
}

async function updateSubject(req, res) {
    console.log("UPDATE recu subject : ");
    console.log(req.body);
    Subject.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, subject) => {
        if(err) {
            console.log(err)
            res.status(400).json(responde({},err.message));
        }else{
            res.status(201).json(responde(subject,`${subject.name} updated`))
        }
    })
}

async function deleteSubject(req, res) {
    Subject.findByIdAndRemove(req.params.id, (err, subject) => {
        if(err){
            console.log(err)
            res.status(400).json(responde({},err.message));
        } 
        else{
            res.status(201).json(responde({},`${subject.name} deleted`));
        } 
    })
}

module.exports = { getSubjects, getSubject, postSubject, updateSubject, deleteSubject };